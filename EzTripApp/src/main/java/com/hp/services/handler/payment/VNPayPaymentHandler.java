/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.payment;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.hp.pojo.Booking;
import com.hp.pojo.BookingStatus;
import com.hp.repositories.BookingRepository;

/**
 *
 * @author Joon
 */
@Component("VNPAY")
@PropertySource("classpath:vnpay.properties")
@Transactional
public class VNPayPaymentHandler implements PaymentHandler {

    @Autowired
    private Environment env;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public String createPaymentLink(Booking booking, String redirectUrl) throws JsonProcessingException {

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TmnCode = this.env.getProperty("VNP_TMNCODE");
        Integer vnp_Amount = booking.getTotalAmount() * 100;
        String vnp_CreateDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String vnp_CurrCode = "VND";
        String vnp_IpAddr = "127.0.0.1";
        String vnp_Locale = "vn";
        String vnp_OrderInfo = String.format("Thanh toan don hang %d voi so tien la %d VND", booking.getId(),
                booking.getTotalAmount());
        String vnp_OrderType = "other";
        String vnp_ReturnUrl = redirectUrl;
        String vnp_ExpireDate = LocalDateTime.now().plusMinutes(30)
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String vnp_TxnRef = String.format("%s%d", vnp_CreateDate, booking.getId());

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Locale", vnp_Locale);
        vnp_Params.put("vnp_CurrCode", vnp_CurrCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Amount", String.valueOf(vnp_Amount));
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                try {
                    String encodedKey = URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString());
                    String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString());

                    hashData.append(fieldName).append('=').append(encodedValue);
                    query.append(encodedKey).append('=').append(encodedValue);
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException("Lỗi khi tạo liên kết thanh toán!");
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String hashSecret = this.env.getProperty("VNP_HASHSECRET");
        System.out.println("Hash data: " + hashData.toString());
        System.out.println("Hash secret: " + hashSecret);

        String vnp_SecureHash = new HmacUtils("HmacSHA512", hashSecret)
                .hmacHex(hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        String queryUrl = query.toString();

        String paymentUrl = this.env.getProperty("VNP_URL") + "?" + queryUrl;

        return paymentUrl;
    }

    @Override
    public void handlePaymentResult(Map<String, String> callbackRequest) {
        String vnp_SecureHash = callbackRequest.get("vnp_SecureHash");

        List<String> fieldNames = new ArrayList<>(callbackRequest.keySet());
        fieldNames.remove("vnp_SecureHash");
        fieldNames.remove("vnp_SecureHashType");
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = callbackRequest.get(fieldName);
            try {
                String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString());
                hashData.append(fieldName).append('=').append(encodedValue);
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException("Lỗi khi xử lý kết quả thanh toán!");
            }

            if (itr.hasNext()) {
                hashData.append('&');
            }
        }

        String secureHash = new HmacUtils("HmacSHA512", this.env.getProperty("VNP_HASHSECRET"))
                .hmacHex(hashData.toString());
        if (!secureHash.equals(vnp_SecureHash)) {
            throw new RuntimeException("Thanh toán không hợp lệ!");
        }

        String vnp_TxnRef = callbackRequest.get("vnp_TxnRef");
        Integer bookingId = Integer.parseInt(vnp_TxnRef.substring(14));
        Booking booking = this.bookingRepository.getBookingById(bookingId);

        if (booking == null || !booking.getStatusId().getName().equals("PENDING")) {
            throw new RuntimeException("Đơn hàng không hợp lệ!");
        }

        String vnp_ResponseCode = callbackRequest.get("vnp_ResponseCode");
        String vnp_TransactionStatus = callbackRequest.get("vnp_TransactionStatus");

        if ("00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus)) {
            booking.setStatusId(new BookingStatus(2));
        }
        else
            throw new RuntimeException("Thanh toán không thành công: ");
    }
}

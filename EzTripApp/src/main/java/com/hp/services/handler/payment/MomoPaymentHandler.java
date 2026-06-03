/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.payment;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.hp.dto.payment.MomoCreateResponseDTO;
import com.hp.pojo.Booking;
import com.hp.pojo.BookingStatus;
import com.hp.repositories.BookingRepository;

/**
 *
 * @author Joon
 */
@Component("MOMO")
@PropertySource("classpath:momo.properties")
@Transactional
public class MomoPaymentHandler implements PaymentHandler {

    @Autowired
    private Environment env;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public String createPaymentLink(Booking booking, String redirectUrl) {
        String partnerCode = this.env.getProperty("MOMO_PARTNER_CODE");
        String accessKey = this.env.getProperty("MOMO_ACCESS_KEY");
        String secretKey = this.env.getProperty("MOMO_SECRET_KEY");
        String requestId = UUID.randomUUID().toString();
        Long amount = booking.getTotalAmount().longValue();
        String dateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String orderId = String.format("%s%s", dateTime, String.valueOf(booking.getId()));
        String orderInfo = "Thanh toán cho dịch vụ: " + booking.getServiceId().getName();
        String ipnUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/callback/momo").toUriString();
        String requestType = "captureWallet";
        String extraData = "";
        String lang = "vi";

        String rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl="
                + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode
                + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        String signature = new HmacUtils("HmacSHA256", secretKey).hmacHex(rawSignature);

        Map<String, String> data = new HashMap<>();
        data.put("partnerCode", partnerCode);
        data.put("requestId", requestId);
        data.put("amount", String.valueOf(amount));
        data.put("orderId", orderId);
        data.put("orderInfo", orderInfo);
        data.put("redirectUrl", redirectUrl);
        data.put("ipnUrl", ipnUrl);
        data.put("requestType", requestType);
        data.put("extraData", extraData);
        data.put("lang", lang);
        data.put("signature", signature);

        RestClient client = RestClient.create(this.env.getProperty("MOMO_PAYMENT_URL"));
        MomoCreateResponseDTO response = client.post()
                .body(data)
                .retrieve()
                .body(MomoCreateResponseDTO.class);

        if (response.resultCode() != 0) {
            throw new RuntimeException("Lỗi khi thực hiện thanh toán bằng MOMO: " + response.message());
        }

        return response.payUrl();
    }

    @Override
    public void handlePaymentResult(Map<String, String> ipnRequest) {
        if (ipnRequest.get("resultCode").equals("0")) {
            String orderId = ipnRequest.get("orderId");
            int bookingId = Integer.parseInt(orderId.substring(14));
            Booking booking = this.bookingRepository.getBookingById(bookingId);

            if (booking == null || !booking.getStatusId().getName().equals("PENDING"))
                return;

            String secretKey = this.env.getProperty("MOMO_SECRET_KEY");
            String accessKey = this.env.getProperty("MOMO_ACCESS_KEY");
            Long amount = booking.getTotalAmount().longValue();
            String extraData = "";
            String message = ipnRequest.get("message");
            String orderInfo = "Thanh toán cho dịch vụ: " + booking.getServiceId().getName();
            String orderType = "momo_wallet";
            String partnerCode = this.env.getProperty("MOMO_PARTNER_CODE");
            String payType = ipnRequest.get("payType");
            String requestId = ipnRequest.get("requestId");
            Long responseTime = Long.parseLong(ipnRequest.get("responseTime"));
            int resultCode = Integer.parseInt(ipnRequest.get("resultCode"));
            Long transId = Long.parseLong(ipnRequest.get("transId"));

            String rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData
                    + "&message=" + message + "&orderId=" + orderId
                    + "&orderInfo=" + orderInfo + "&orderType=" + orderType + "&partnerCode=" + partnerCode
                    + "&payType=" + payType + "&requestId=" + requestId + "&responseTime=" + responseTime
                    + "&resultCode=" + resultCode + "&transId=" + transId;
            String signature = new HmacUtils("HmacSHA256", secretKey).hmacHex(rawSignature);

            if (signature.equals(ipnRequest.get("signature"))) {
                booking.setStatusId(new BookingStatus(2));
            }

        } else {
            throw new RuntimeException("Thanh toán không thành công: " + ipnRequest.get("message"));
        }
    }

}

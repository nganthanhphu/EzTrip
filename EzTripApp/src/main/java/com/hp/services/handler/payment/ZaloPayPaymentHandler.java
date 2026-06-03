/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.services.handler.payment;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hp.dto.payment.ZaloPayCreateResponseDTO;
import com.hp.pojo.Booking;
import com.hp.pojo.BookingStatus;
import com.hp.repositories.BookingRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 *
 * @author Joon
 */
@Component("ZALOPAY")
@PropertySource("classpath:zalopay.properties")
@Transactional
public class ZaloPayPaymentHandler implements PaymentHandler {

    @Autowired
    private Environment env;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public String createPaymentLink(Booking booking, String redirectUrl) throws JsonProcessingException {
        int app_id = Integer.parseInt(this.env.getProperty("ZALOPAY_APPID"));
        String app_user = booking.getCustomerId().getUserId().getFullname();
        String dateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        String app_trans_id = String.format("%s_%s%s", dateTime.substring(0, 6), dateTime.substring(6, 12), booking.getId());
        Long app_time = System.currentTimeMillis();
        Long expire_duration_seconds = 900L;
        Long amount = booking.getTotalAmount().longValue();

        Map<String, Object> itemMap = new HashMap<>();
        itemMap.put("itemid", booking.getServiceId().getId());
        itemMap.put("itemname", booking.getServiceId().getName());
        itemMap.put("itemprice", amount);
        itemMap.put("itemquantity", booking.getQuantity());

        ObjectMapper mapper = new ObjectMapper();

        String item = "[" + mapper.writeValueAsString(itemMap) + "]";

        String description = "Thanh toán cho dịch vụ: " + booking.getServiceId().getName();

        Map<String, Object> embedDataMap = new HashMap<>();
        embedDataMap.put("redirecturl", redirectUrl);
        embedDataMap.put("preferred_payment_method", List.of());
        String embed_data = mapper.writeValueAsString(embedDataMap);

        String bank_code = "";

        String rawMac = String.format("%d|%s|%s|%d|%d|%s|%s",
                app_id, app_trans_id, app_user, amount, app_time, embed_data, item);

        String key1 = this.env.getProperty("ZALOPAY_KEY1");

        String mac = new HmacUtils("HmacSHA256", key1).hmacHex(rawMac);

        String callback_url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/callback/zalopay").toUriString();

        Map<String, Object> data = new HashMap<>();
        data.put("app_id", app_id);
        data.put("app_user", app_user);
        data.put("app_trans_id", app_trans_id);
        data.put("app_time", app_time);
        data.put("expire_duration_seconds", expire_duration_seconds);
        data.put("amount", amount);
        data.put("embed_data", embed_data);
        data.put("item", item);
        data.put("description", description);
        data.put("mac", mac);
        data.put("callback_url", callback_url);
        data.put("bank_code", bank_code);


        RestClient client = RestClient.create(this.env.getProperty("ZALOPAY_PAYMENT_URL"));
        ZaloPayCreateResponseDTO response = client.post()
                .header("Content-Type", "application/json")
                .body(mapper.writeValueAsString(data))
                .retrieve()
                .body(ZaloPayCreateResponseDTO.class);


        if (response.return_code() == 2) {
            throw new RuntimeException("Lỗi khi thực hiện thanh toán bằng ZaloPAY: " + response.return_message());
        }

        return response.order_url();
    }

    @Override
    public void handlePaymentResult(Map<String, String> callbackRequest) {
        String data = callbackRequest.get("data");
        String key2 = this.env.getProperty("ZALOPAY_KEY2");
        String mac = new HmacUtils("HmacSHA256", key2).hmacHex(data);

        if (!mac.equals(callbackRequest.get("mac"))) {
            throw new RuntimeException("Thanh toán không hợp lệ!");
        }

        ObjectMapper mapper = new ObjectMapper();
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> dataMap = mapper.readValue(data, Map.class);
            String app_trans_id = (String) dataMap.get("app_trans_id");
            Integer bookingId = Integer.parseInt(app_trans_id.split("_")[1].substring(6));

            Booking booking = this.bookingRepository.getBookingById(bookingId);
            if (booking == null || !booking.getStatusId().getName().equals("PENDING"))
                throw new RuntimeException("Đơn hàng không hợp lệ!");

            booking.setStatusId(new BookingStatus(2));

        } catch (JsonProcessingException ex) {
            throw new RuntimeException("Lỗi khi xử lý kết quả thanh toán!");
        }

    }

}

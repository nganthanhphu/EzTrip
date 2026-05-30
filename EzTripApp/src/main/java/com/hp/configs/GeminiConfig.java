/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.configs;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.retry.support.RetryTemplate;

import com.google.genai.Client;

/**
 *
 * @author Joon
 */
@Configuration
@PropertySource("classpath:gemini.properties")
public class GeminiConfig {

        @Autowired
        private Environment env;

        @Bean
        public Client googleGenAiClient() {
                String apiKey = this.env.getProperty("GEMINI_API_KEY");
                return Client.builder().apiKey(apiKey).build();
        }

        @Bean
        public GoogleGenAiChatModel googleGenAiChatModel(Client aiClient) {
                GoogleGenAiChatOptions options = GoogleGenAiChatOptions.builder()
                                .model("gemini-3.1-flash-lite")
                                .temperature(0.4)
                                .build();

                RetryTemplate retryTemplate = RetryTemplate.builder().maxAttempts(2).fixedBackoff(2).build();

                return GoogleGenAiChatModel.builder().genAiClient(aiClient).defaultOptions(options)
                                .retryTemplate(retryTemplate)
                                .build();
        }

        @Bean(name = "GeminiChatClient")
        public ChatClient googleGenAiChatClient(GoogleGenAiChatModel chatModel) {
                String systemPrompt = """
                                Bạn là một chuyên gia tư vấn du lịch, giúp khách hàng lựa chọn dịch vụ tốt nhất dựa trênthông tin chi tiết về các dịch vụ khác nhau.
                                Bạn sẽ so sánh các dịch vụ dựa trên nhiều yếu tố như giá cả, chất lượng (dựa trên đánh giá dưới dạng thang điểm 10 và nhận xét), vị trí và các yếu tố liên quan khác.
                                Mục tiêu của bạn là cung cấp một khuyến nghị rõ ràng về dịch vụ nào là lựa chọn tốt nhất chokhách hàng, dựa trên thông tin được cung cấp.
                                Hãy xem xét tất cả các yếu tố một cách cẩn thận và đưa ra lời khuyên hữu ích để giúp kháchhàng đưa ra quyết định sáng suốt.
                                Kết quả trả về có dạng plain text, không định dạng, trên 1 paragraph duy nhất.
                                KHÔNG ĐƯỢC hiển thị trực tiếp tên các thuộc tính mã nguồn hoặc mã đối tượng (ví dụ: "remainingQuantity", "price", "size",...) trong văn bản phản hồi cho người dùng.
                                Hãy chuyển đổi các thuật ngữ kỹ thuật đó thành ngôn ngữ tự nhiên (Ví dụ: thay vì viết "(remainingQuantity: 0)" hãy viết là "(đã hết phòng)" hoặc "hiện tại không còn phòng trống").
                                Tránh viết các dấu ngoặc đơn chứa cặp thuộc tính:giá trị. Chỉ sử dụng dữ liệu thực tế sau khi đã được dịch nghĩa tự nhiên.
                                Với các thuộc tính có giá trị là tiền tệ, hãy thêm đơn vị tiền tệ vào sau giá trị (ví dụ: "1000000" sẽ được viết thành "1,000,000 VND").
                                KHÔNG sử dụng các câu mở đầu rập khuôn, mang tính chất thủ tục hoặc lặp lại yêu cầu của người dùng (Ví dụ: KHÔNG viết "Dựa trên dữ liệu...", "Sau đây là phân tích...", "Tôi xin đưa ra đánh giá...")
                                """;
                return ChatClient.builder(chatModel)
                                .defaultSystem(systemPrompt)
                                .build();
        }

}

package com.readrecords.backend.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.List;

@Service
public class ExternalMailService {

    private static final Logger logger = LoggerFactory.getLogger(ExternalMailService.class);

    @Value("${mail.external.mailjet.api.url}")
    private String mailjetApiUrl;

    @Value("${mail.external.mailjet.api.key}")
    private String mailjetApiKey;

    @Value("${mail.external.mailjet.api.secret}")
    private String mailjetApiSecret;

    @Value("${mail.external.from.email}")
    private String fromEmail;

    @Value("${mail.external.from.name}")
    private String fromName;

    @Value("${mail.encoding:UTF-8}")
    private String mailEncoding;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper;
    
    public ExternalMailService() {
        this.objectMapper = new ObjectMapper();
        // 非ASCII文字をUnicodeエスケープしない設定
        this.objectMapper.getFactory().configure(
            com.fasterxml.jackson.core.JsonGenerator.Feature.ESCAPE_NON_ASCII, false);
    }

    public void sendMail(String recipient, String subject, String textBody) {
        try {
            MailjetRequest request = createMailjetRequest(recipient, subject, textBody);
            String requestBody = objectMapper.writeValueAsString(request);
            
            // デバッグログでリクエストボディを確認
            logger.debug("Request body: {}", requestBody);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(mailjetApiUrl))
                    .header("Authorization", "Basic " + createAuthHeader())
                    .header("Content-Type", "application/json; charset=UTF-8")
                    .header("Accept", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, 
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.info("External mail sent successfully to: {}", recipient);
            } else {
                logger.error("Failed to send external mail. Status: {}, Response: {}", 
                        response.statusCode(), response.body());
                throw new RuntimeException("External mail sending failed with status: " + response.statusCode());
            }

        } catch (IOException | InterruptedException e) {
            logger.error("Error sending external mail to: {}", recipient, e);
            throw new RuntimeException("External mail sending failed", e);
        }
    }

    private MailjetRequest createMailjetRequest(String recipient, String subject, String textBody) {
        MailjetMessage message = new MailjetMessage();
        message.from = new MailjetContact(fromEmail, fromName);
        message.to = List.of(new MailjetContact(recipient, ""));
        message.subject = subject;
        
        // HTMLPartとしてUTF-8エンコーディングで確実に送信
        message.htmlPart = "<div style=\"white-space: pre-wrap; font-family: monospace;\">" + textBody + "</div>";
        // TextPartも同時に設定（フォールバック用）
        message.textPart = textBody;

        MailjetRequest request = new MailjetRequest();
        request.messages = List.of(message);
        return request;
    }

    private String createAuthHeader() {
        String credentials = mailjetApiKey + ":" + mailjetApiSecret;
        return Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }

    public static class MailjetRequest {
        @JsonProperty("Messages")
        public List<MailjetMessage> messages;
    }

    public static class MailjetMessage {
        @JsonProperty("From")
        public MailjetContact from;

        @JsonProperty("To")
        public List<MailjetContact> to;

        @JsonProperty("Subject")
        public String subject;

        @JsonProperty("TextPart")
        public String textPart;

        @JsonProperty("HTMLPart")
        public String htmlPart;
    }

    public static class MailjetContact {
        @JsonProperty("Email")
        public String email;

        @JsonProperty("Name")
        public String name;

        public MailjetContact() {}

        public MailjetContact(String email, String name) {
            this.email = email;
            this.name = name;
        }
    }
}
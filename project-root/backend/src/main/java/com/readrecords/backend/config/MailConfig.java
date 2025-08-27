package com.readrecords.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Value("${spring.mail.host}")
    private String mailHost;

    @Value("${spring.mail.port}")
    private int mailPort;

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);
        
        // UTF-8エンコーディングを強制設定
        mailSender.setDefaultEncoding("UTF-8");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "false");
        props.put("mail.smtp.starttls.enable", "false");
        props.put("mail.debug", "true"); // デバッグ有効化
        
        // 文字エンコーディングの強制設定
        props.put("mail.mime.charset", "UTF-8");
        props.put("mail.smtp.charset", "UTF-8");
        props.put("mail.mime.encodefilename", "true");
        props.put("mail.mime.decodefilename", "true");
        props.put("mail.mime.encodeparameters", "true");
        props.put("mail.mime.multipart.allowempty", "true");
        
        // システムプロパティとしても設定
        System.setProperty("mail.mime.charset", "UTF-8");
        System.setProperty("file.encoding", "UTF-8");

        return mailSender;
    }
}
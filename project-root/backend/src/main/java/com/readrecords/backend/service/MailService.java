package com.readrecords.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailService {

    private static final Logger logger = LoggerFactory
            .getLogger(MailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${mail.template.otp.subject}")
    private String otpMailSubject;

    @Value("${mail.template.otp.body}")
    private String otpMailBodyTemplate;

    /**
     * 汎用のメール送信処理。
     *
     * @param recipient 送信先メールアドレス
     * @param subject   メール件名
     * @param body      メール本文
     */
    public void sendMail(String recipient, String subject, String body) {
        try {
            // MimeMessage の生成
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            // MimeMessageHelperでMimeMessageをラップ（multipart=false,
            // エンコーディングはUTF-8）
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false,
                    "UTF-8");

            // 差出人にメールアドレスと表示名を設定
            helper.setFrom(new InternetAddress("system-sender@librolog.com",
                    "Libro Log"));
            // 送信先、件名、本文の設定
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(body, false);

            // メール送信
            mailSender.send(mimeMessage);
            logger.info("メールを送信しました: {}", recipient);
        } catch (Exception e) {
            logger.error("メール送信に失敗しました: {}", recipient, e);
            throw new RuntimeException("メール送信に失敗しました", e);
        }
    }

    /**
     * OTP認証用のメール送信
     *
     * @param recipient  送信先メールアドレス
     * @param otp        ワンタイムパスワード
     * @param expireTime 有効期限（フォーマット済み文字列）
     */
    public void sendOtpMail(String recipient, String otp, String expireTime) {
        String subject = otpMailSubject;
        String body = otpMailBodyTemplate
                .replace("{otp}", otp)
                .replace("{expireTime}", expireTime);

        sendMail(recipient, subject, body);
        logger.info("OTP mail sent to: {}", recipient);
    }
}

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

    @Autowired
    private ExternalMailService externalMailService;

    @Value("${mail.template.otp.subject}")
    private String otpMailSubject;

    @Value("${mail.template.otp.body}")
    private String otpMailBodyTemplate;

    @Value("${mail.external.enabled:false}")
    private boolean externalMailEnabled;

    @Value("${mail.encoding:UTF-8}")
    private String mailEncoding;

    /**
     * 汎用のメール送信処理。
     *
     * @param recipient 送信先メールアドレス
     * @param subject   メール件名
     * @param body      メール本文
     */
    public void sendMail(String recipient, String subject, String body) {
        if (externalMailEnabled) {
            sendExternalMail(recipient, subject, body);
        } else {
            sendLocalMail(recipient, subject, body);
        }
    }

    /**
     * 外部メール送信サービスを使用してメール送信
     */
    private void sendExternalMail(String recipient, String subject, String body) {
        try {
            externalMailService.sendMail(recipient, subject, body);
            logger.info("外部メール送信サービスでメールを送信しました: {}", recipient);
        } catch (Exception e) {
            logger.error("外部メール送信に失敗しました: {}", recipient, e);
            throw new RuntimeException("外部メール送信に失敗しました", e);
        }
    }

    /**
     * ローカルメール送信（mailpit使用）
     */
    private void sendLocalMail(String recipient, String subject, String body) {
        try {
            // システムプロパティでUTF-8を強制設定
            System.setProperty("mail.mime.charset", "UTF-8");
            System.setProperty("file.encoding", "UTF-8");
            
            // MimeMessage の生成
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            
            // 手動でUTF-8エンコーディングを設定
            mimeMessage.setFrom(new InternetAddress("system-sender@librolog.com", "Libro Log", "UTF-8"));
            mimeMessage.setRecipient(jakarta.mail.Message.RecipientType.TO, new InternetAddress(recipient));
            mimeMessage.setSubject(subject, "UTF-8");
            
            // UTF-8でテキスト本文を設定
            mimeMessage.setText(body, "UTF-8");
            
            // 明示的にContent-Typeヘッダーを設定
            mimeMessage.setHeader("Content-Type", "text/plain; charset=UTF-8");
            mimeMessage.setHeader("Content-Transfer-Encoding", "base64");
            
            // メール送信
            mailSender.send(mimeMessage);
            logger.info("ローカルメールを送信しました: {}", recipient);
        } catch (Exception e) {
            logger.error("ローカルメール送信に失敗しました: {}", recipient, e);
            throw new RuntimeException("ローカルメール送信に失敗しました", e);
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

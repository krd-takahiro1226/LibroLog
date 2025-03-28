package com.readrecords.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.readrecords.backend.repository.EmailChangeRepository;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class EmailChangeServiceImpl implements EmailChangeService {
  private static final Logger logger = LoggerFactory.getLogger(EmailChangeServiceImpl.class);

  @Autowired
  EmailChangeRepository emailChangeRepository;

  // JavaMailSenderのインジェクション
  @Autowired
  private JavaMailSender mailSender;

  @Override
  public void changeEmail(String userId, String newUserEmail) {
    logger.info("Updating email for userId: {}", userId);
    int updatedRows = emailChangeRepository.updateEmail(userId, newUserEmail);
    if (updatedRows == 0) {
      throw new IllegalArgumentException("User not found or email unchanged.");
    }

    // 共通のメール送信処理を呼び出す
    sendMail(newUserEmail, "Libro Logからの確認メールです", "");
  }

  /**
   * 汎用のメール送信処理。
   *
   * @param recipient 送信先メールアドレス
   * @param subject   メール件名
   * @param body      メール本文
   */

  private void sendMail(String recipient, String subject, String body) {
    try {
      // MimeMessageの生成
      MimeMessage mimeMessage = mailSender.createMimeMessage();
      // MimeMessageHelperでMimeMessageをラップ（multipart=false、エンコーディングはUTF-8）
      MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");

      // 差出人のメールアドレスと表示名を設定
      helper.setFrom(new InternetAddress("system-sender@librolog.com", "Libro Log"));
      helper.setTo(recipient);
      helper.setSubject(subject);
      helper.setText(body, false);

      mailSender.send(mimeMessage);
      logger.info("メールを送信しました: {}", recipient);
    } catch (Exception e) {
      logger.error("メール送信に失敗しました: {}", recipient, e);
      throw new RuntimeException("メール送信に失敗しました", e);
    }
  }
}

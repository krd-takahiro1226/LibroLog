package com.readrecords.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readrecords.backend.repository.EmailChangeRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class EmailChangeServiceImpl implements EmailChangeService {
  private static final Logger logger = LoggerFactory.getLogger(EmailChangeServiceImpl.class);

  @Autowired
  EmailChangeRepository emailChangeRepository;

  // JavaMailSenderのインジェクション
  @Autowired
  private MailService mailService;

  @Override
  public void changeEmail(String userId, String newUserEmail) {
    logger.info("Updating email for userId: {}", userId);
    int updatedRows = emailChangeRepository.updateEmail(userId, newUserEmail);
    if (updatedRows == 0) {
      throw new IllegalArgumentException("User not found or email unchanged.");
    }

    // 共通のメール送信処理を呼び出す
    mailService.sendMail(newUserEmail, "Libro Logからの確認メールです", "");
  }
}

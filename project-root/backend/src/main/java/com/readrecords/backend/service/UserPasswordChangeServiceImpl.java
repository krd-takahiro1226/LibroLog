package com.readrecords.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.readrecords.backend.exception.IncorrectPasswordException;
import com.readrecords.backend.repository.UserPasswordChangeRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserPasswordChangeServiceImpl implements UserPasswordChangeService {
  private static final Logger logger = LoggerFactory.getLogger(UserPasswordChangeServiceImpl.class);

  @Autowired
  PasswordEncoder passwordEncoder;
  @Autowired
  UserPasswordChangeRepository userPasswordChangeRepository;

  @Override
  public void changePassword(
      String userId, String oldPassword, String newPassword) {

    logger.info("Updating password for userId: {}", userId);

    // 現在のパスワードをデータベースから取得
    String currentHashedPassword = userPasswordChangeRepository.findById(userId).get().getPassword();

    // 現在のパスワードが正しいか確認
    if (!passwordEncoder.matches(oldPassword, currentHashedPassword)) {
      throw new IncorrectPasswordException("The entered password is incorrect.");
    }

    // 新しいパスワードをハッシュ化して保存
    String hashPassword = passwordEncoder.encode(newPassword);
    userPasswordChangeRepository.updatePassword(userId, hashPassword);
  }
}

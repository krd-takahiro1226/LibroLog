package com.readrecords.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.readrecords.backend.repository.UserPasswordChangeRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserPasswordChangeServiceImpl implements UserPasswordChangeService {

  @Autowired private PasswordEncoder passwordEncoder;
  @Autowired private UserPasswordChangeRepository userPassChangeRepository;

  @Override
  public void changePassword(
      String userId, String oldPassword, String newPassword, String confirmPassword) {

    // 新しいパスワードが一致しているか確認
    if (!newPassword.equals(confirmPassword)) {
      throw new IllegalArgumentException("Passwords do not match.");
    }

    // 現在のパスワードをデータベースから取得
    String currentHashedPassword = userPassChangeRepository.findById(userId).get().getPassword();

    // 現在のパスワードが正しいか確認
    if (!passwordEncoder.matches(oldPassword, currentHashedPassword)) {
      throw new IllegalArgumentException("The entered password is incorrect.");
    }

    // 新しいパスワードをハッシュ化して保存
    String hashPassword = passwordEncoder.encode(newPassword);
    userPassChangeRepository.updatePassword(userId, hashPassword);
  }
}

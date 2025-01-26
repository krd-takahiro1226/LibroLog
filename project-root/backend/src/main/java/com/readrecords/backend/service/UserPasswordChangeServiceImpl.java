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
  @Autowired private UserPasswordChangeRepository userPasswordChangeRepository;

  @Override
  public void changePassword(
      String userId, String oldPassword, String newPassword) {

    // 新しいパスワードが一致しているか確認する処理は削除
    // if (!newPassword.equals(confirmPassword)) {
    //   throw new IllegalArgumentException("Passwords do not match.");
    // }

    // 現在のパスワードをデータベースから取得
    String currentHashedPassword = userPasswordChangeRepository.findById(userId).get().getPassword();

    // GPTによる修正案（仮）
    // String currentHashedPassword = userPassChangeRepository.findById(userId)
    //   .orElseThrow(() -> new IllegalArgumentException("User not found for the given userId"))
    //   .getPassword();


    // 現在のパスワードが正しいか確認
    if (!passwordEncoder.matches(oldPassword, currentHashedPassword)) {
      throw new IllegalArgumentException("The entered password is incorrect.");
    }

    // 新しいパスワードをハッシュ化して保存
    String hashPassword = passwordEncoder.encode(newPassword);
    userPasswordChangeRepository.updatePassword(userId, hashPassword);
  }
}

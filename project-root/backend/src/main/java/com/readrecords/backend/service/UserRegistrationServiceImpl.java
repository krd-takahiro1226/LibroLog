package com.readrecords.backend.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.readrecords.backend.repository.UserRegistrationRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserRegistrationServiceImpl implements UserRegistrationService {
  @Autowired
  PasswordEncoder passwordEncoder;
  @Autowired UserRegistrationRepository userRegistrationRepository;
  @Override
  public void userRegistration(String username, String email, String password, String confirmPassword) {
    String hashPassword = passwordEncoder.encode(password);
    String userId = UUID.randomUUID().toString();
    userRegistrationRepository.insertUserRecords(userId, username, email, hashPassword);
  }
  @Override
  public boolean checkPassword(String password, String confirmPassword) {
    if (!password.equals(confirmPassword)) {
      // エラーハンドリングしたいが追いついていない
      // throw new IllegalArgumentException("パスワードが一致しません。");
      return false;
    }
    return true;
  }
}

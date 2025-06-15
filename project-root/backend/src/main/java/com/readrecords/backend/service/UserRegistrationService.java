package com.readrecords.backend.service;

import com.readrecords.backend.repository.UserRegistrationRepository;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserRegistrationService {
  @Autowired
  PasswordEncoder passwordEncoder;
  @Autowired
  UserRegistrationRepository userRegistrationRepository;

  public void userRegistration(
      String username, String email, String password, String confirmPassword) {
    String hashPassword = passwordEncoder.encode(password);
    String userId = UUID.randomUUID().toString();
    userRegistrationRepository.insertUserRecords(userId, username, email,
        hashPassword);
  }

  public boolean checkPassword(String password, String confirmPassword) {
    if (!password.equals(confirmPassword)) {
      // エラーハンドリングしたいが追いついていない
      // throw new IllegalArgumentException("パスワードが一致しません。");
      return false;
    }
    return true;
  }
}

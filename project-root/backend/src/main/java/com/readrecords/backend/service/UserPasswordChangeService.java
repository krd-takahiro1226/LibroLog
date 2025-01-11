package com.readrecords.backend.service;

public interface UserPasswordChangeService {
    void changePassword(String userId, String oldPassword, String newPassword, String confirmPassword);
  }

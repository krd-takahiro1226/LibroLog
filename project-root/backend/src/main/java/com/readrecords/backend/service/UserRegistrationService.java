package com.readrecords.backend.service;

public interface UserRegistrationService {
  public void userRegistration(String username, String email, String password, String confirmPassword);
  boolean checkPassword(String password, String confirmPassword);
}

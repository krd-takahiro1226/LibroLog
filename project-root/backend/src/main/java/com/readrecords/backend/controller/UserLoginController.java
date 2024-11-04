package com.readrecords.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.readrecords.backend.entity.UserLogin;

@RestController
public class UserLoginController {

  @Autowired
  private AuthenticationManager authenticationManager;

  @PostMapping("/login")
  public ResponseEntity<String> authenticateUser(@RequestBody UserLogin userlogin) {
    try {
      Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(userlogin.getUsername(), userlogin.getPassword())
      );

      SecurityContextHolder.getContext().setAuthentication(authentication);

      // 認証成功のレスポンスを返却
      return ResponseEntity.ok("Authentication successful");
    } catch (AuthenticationException e) {
      // 認証失敗時のエラーレスポンス
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }
  }
}

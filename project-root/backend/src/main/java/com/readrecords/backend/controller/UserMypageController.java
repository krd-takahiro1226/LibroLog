package com.readrecords.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readrecords.backend.entity.UserLogin;
import com.readrecords.backend.repository.UserLoginRepository;

@RestController
@RequestMapping("/api/user")
public class UserMypageController {

    @Autowired UserLoginRepository userLoginRepository;

    private static final Logger logger = LoggerFactory.getLogger(UsernameChangeController.class);

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getCurrentUser(Authentication authentication) {
        // 認証済みのuserIdを取得
        String userId = getUserId(authentication);

        // Repositoryからユーザー情報を取得
        UserLogin user = userLoginRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // ユーザー情報をレスポンスとして返却
        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("name", user.getUsername());
        userInfo.put("email", user.getEmail());
        
        // 管理者の場合のみroleを追加
        if ("admin".equals(user.getRole())) {
            userInfo.put("role", user.getRole());
        }

        return ResponseEntity.ok(userInfo);
    }


    private String getUserId (Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
          logger.warn("Unauthorized access attempt");
          throw new IllegalStateException("Authentication is required to fetch userId");
        }
    
        try {
          logger.info("Authenticated user: {}", authentication.getName());
          System.out.println("Authentication: " + authentication);
          String userId = authentication.getDetails().toString();
          logger.info("Fetching records for userId: {}", userId);
          return userId;
        } 
        catch (Exception e) {
          logger.error("Error fetching records", e);
          throw new IllegalStateException("Failed to fetch userId", e);
        }
      }
}

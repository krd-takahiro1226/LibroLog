package com.readrecords.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readrecords.backend.dto.UserReadRecordsDto;
import com.readrecords.backend.security.UserLoginDetails;
import com.readrecords.backend.service.ReadRecordsService;

// 初期メニューから各種機能へ遷移させるためのController
@RestController
public class MenuController {
  @Autowired
  ReadRecordsService readRecordsService;
  @GetMapping("/showRecords")
  public List<UserReadRecordsDto> showUserReadRecords(Model model) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserLoginDetails userDetails = (UserLoginDetails) authentication.getPrincipal();
    String userId = userDetails.getUserId();
    return readRecordsService.getReadRecordsByUserId(userId);
  }

  @GetMapping("/searchBooks")
  public ResponseEntity<String> showSearchWindow(){
  return ResponseEntity.ok("searchBooks endpoint");
  }
}

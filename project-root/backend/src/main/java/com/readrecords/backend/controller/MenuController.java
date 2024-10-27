package com.readrecords.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.readrecords.backend.dto.UserReadRecordsDto;
import com.readrecords.backend.security.UserLoginDetails;
import com.readrecords.backend.service.ReadRecordsService;

// 初期メニューから各種機能へ遷移させるためのController
@Controller
public class MenuController {
  @Autowired
  ReadRecordsService readRecordsService;
  @RequestMapping("/showRecords")
  @GetMapping
  public String showAUserReadRecords(Model model) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserLoginDetails userDetails = (UserLoginDetails) authentication.getPrincipal();
    String userId = userDetails.getUserId();
    List<UserReadRecordsDto> readRecords = readRecordsService.getReadRecordsByUserId(userId);
    model.addAttribute("readRecords", readRecords);
    return "show";
  }

  @RequestMapping("/searchBooks")
  @GetMapping
  public String showSearchWindow(){
  return "search";
  }
}

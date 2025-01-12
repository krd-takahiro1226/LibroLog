package com.readrecords.backend.controller;

import com.readrecords.backend.security.UserLoginDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/menu")
public class ShowMenuController {
  @GetMapping
  public String showMenu(Model model) {
    Authentication authentication = SecurityContextHolder.getContext()
        .getAuthentication();
    UserLoginDetails userDetails = (UserLoginDetails) authentication
        .getPrincipal();
    String userId = userDetails.getUserId();
    model.addAttribute("userId", userId);
    return "menu";
  }
}

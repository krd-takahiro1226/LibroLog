package com.readrecords.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.readrecords.backend.repository.UserLoginRepostoty;
import com.readrecords.backend.service.UserLoginDetailsService;

@Controller
public class UserLoginController {
  @Autowired
  UserLoginDetailsService userLoginDetailsService;
  @Autowired
  PasswordEncoder passwordEncoder;
  @Autowired
  UserLoginRepostoty userLoginRepostoty;
  @RequestMapping(value = "/login", method = RequestMethod.GET)
  public String showLoginWindow() {
    return "userLogin";
  }
}

package com.readrecords.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.readrecords.backend.service.UserRegistrationServiceImpl;


@Controller
@RequestMapping("/userRegistration")
public class UserRegistrationController {
  @Autowired
  private UserRegistrationServiceImpl userRegistrationService;
  @RequestMapping(method=RequestMethod.GET)
  public String showregisterWindow() {
      return "userRegister";
  }

  @RequestMapping(method=RequestMethod.POST)
  public String registerUser(@RequestParam String username, @RequestParam String email, @RequestParam String password, @RequestParam String confirmPassword) {
    boolean check = userRegistrationService.checkPassword(password, confirmPassword);
    if (!check){
      return "redirect:/userRegistration?error=true";
    }
    userRegistrationService.userRegistration(username, email, password, confirmPassword);
    return "completeRegister";
  }
}

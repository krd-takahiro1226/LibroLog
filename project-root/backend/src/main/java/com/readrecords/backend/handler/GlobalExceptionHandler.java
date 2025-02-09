package com.readrecords.backend.handler;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(Exception.class)
  public String handleGeneralException(Exception ex, Model model) {
    ex.printStackTrace();
    model.addAttribute("errorMessage", "予期しないエラーが発生しました。");
    return "error/generalError";
  }
}

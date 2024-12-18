package com.readrecords.backend.form;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserLoginForm {
  @NotNull
  @Max(50)
  private String username;

  @NotNull
  @Max(255)
  private String password;
}

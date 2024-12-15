package com.readrecords.backend.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegistrationForm {
    @NotNull
    @Size(max = 50)
    private String username;
    @NotNull
    @Email
    private String email;
    @NotNull
    @Size(max = 255)
    private String password;
    @NotNull
    @Size(max = 255)
    private String confirmPassword;
}

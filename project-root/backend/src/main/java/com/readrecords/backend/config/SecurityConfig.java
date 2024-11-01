package com.readrecords.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.readrecords.backend.service.UserLoginDetailsService;

@Configuration
public class SecurityConfig {

  private final UserLoginDetailsService userLoginDetailsService;

  public SecurityConfig(UserLoginDetailsService userLoginDetailsService) {
    this.userLoginDetailsService = userLoginDetailsService;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(AbstractHttpConfigurer::disable)
      .cors(withDefaults -> {} )
      .authorizeHttpRequests(authorize -> authorize
        .requestMatchers("/login", "/userRegistration").permitAll()
        .anyRequest().authenticated()
      )
      .sessionManagement(session -> session
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      .logout(logout -> logout
        .logoutUrl("/logout") // ログアウトのURL
        .logoutSuccessUrl("/login") // ログアウト後のリダイレクトURL
        .invalidateHttpSession(true) // セッションの無効化
        .deleteCookies("JSESSIONID") // クッキーの削除
      )
      .authenticationProvider(authenticationProvider())
      .httpBasic(withDefaults -> {}); // 必要に応じて削除可能

    return http.build();
  }


  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

@Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userLoginDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
  
  @Bean
  public UserDetailsService userDetailsService() {
    return userLoginDetailsService;
  }
}

package com.readrecords.backend.config;

import com.readrecords.backend.security.JwtAuthorizationFilter;
import com.readrecords.backend.service.UserLoginDetailsService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

  private final UserLoginDetailsService userLoginDetailsService;

  public SecurityConfig(UserLoginDetailsService userLoginDetailsService) {
    this.userLoginDetailsService = userLoginDetailsService;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http)
      throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(
            authorize -> authorize
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
                .requestMatchers("/login", "/userRegistration").permitAll()
                .anyRequest()
                .authenticated())
        .addFilterBefore(new JwtAuthorizationFilter(),
            UsernamePasswordAuthenticationFilter.class)
        .sessionManagement(
            session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .logout(
            logout -> logout
                .logoutUrl("/logout") // ログアウトのURL
                //.logoutSuccessUrl("/login") // ログアウト後のリダイレクトURL
                .logoutSuccessHandler((req,res,auth) ->
                  res.setStatus(HttpServletResponse.SC_NO_CONTENT)) 
                .invalidateHttpSession(true) // セッションの無効化
                .deleteCookies("JSESSIONID") // クッキーの削除
        )
        .authenticationProvider(authenticationProvider());

    return http.build();
  }

  @Bean
  public AuthenticationManager authenticationManager(
      AuthenticationConfiguration authenticationConfiguration)
      throws Exception {
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

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    // ReactアプリのURL
    configuration.addAllowedOrigin("https://frontend-service-968408560945.asia-northeast1.run.app");
    configuration.addAllowedOrigin("https://librolog.com");
    // 全てのHTTPメソッドを許可
    configuration.addAllowedMethod("*");
    // 全てのヘッダーを許可
    configuration.addAllowedHeader("*");
    // 認証情報を含むリクエストを許可
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}

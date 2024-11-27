package com.readrecords.backend.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

  private static final long EXPIRATION_TIME = 15 * 60 * 1000; // 15分
  private static final String SECRET_KEY = "your-very-long-and-secure-random-key-here-your-very-long-and-secure-random-key-here-64-bytes-long";

  private static Key getSigningKey() {
      // // String secret = System.getenv("JWT_SECRET_KEY"); // 環境変数から取得
      // // if (secret == null || secret.isEmpty()) {
      // //     throw new IllegalStateException("JWT_SECRET_KEY is not configured");
      // // }
      // String secret = "secretKey";
      // String base64Key = Base64.getEncoder().encodeToString(secret.getBytes());

      // byte[] keyBytes = Base64.getDecoder().decode(base64Key); // Base64でデコード
      // return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName()); // Keyオブジェクトを作成

      // byte[] keyBytes = Keys.secretKeyFor(SignatureAlgorithm.HS512).getEncoded(); // 安全なキーを生成
      // return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName());

      byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
      return Keys.hmacShaKeyFor(keyBytes);
  }

  public static String generateToken(Authentication authResult) {
      UserLoginDetails user = (UserLoginDetails) authResult.getPrincipal();

      return Jwts.builder()
              .setSubject(user.getUsername())
              .claim("userId", user.getUserId())
              .setIssuedAt(new Date())
              .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
              .signWith(getSigningKey(), SignatureAlgorithm.HS512) // Keyを使用
              .compact();
  }

  public static Authentication validateToken(String token) {
    try {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) 
                .build()
                .parseClaimsJws(token)
                .getBody();
        System.out.println("Claims: " + claims);

        String username = claims.getSubject();
        String userId = claims.get("userId", String.class);

        System.out.println("Username: " + username);
        System.out.println("User ID: " + userId);

        if (username != null && userId != null) {
          try {
            System.out.println("Token validated successfully for username: " + username);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null, null);
            authentication.setDetails(userId);
            return authentication;
        }
        catch (Exception e) {
          System.err.println("Error in loadUserByUsername: " + e.getMessage());
          e.printStackTrace();
          throw e;
        }
      }
        System.out.println("Token is invalid or username is null");
        return null;
    } catch (JwtException e) {
        System.out.println("Token validation failed");
        throw e;
    }
  }
}

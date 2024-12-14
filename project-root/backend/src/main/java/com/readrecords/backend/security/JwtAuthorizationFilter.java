package com.readrecords.backend.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = resolveToken(request);
        System.out.println("Token: " + token);

        if (token != null) {
            try {
                System.out.println("Token is not null");
                // トークンの検証
                Authentication authentication = jwtUtils.validateToken(token);
                if (authentication != null) {
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("Authentication in SecurityContext: " + authentication);
                    System.out.println("SecurityContext Authentication: "
                            + SecurityContextHolder.getContext().getAuthentication());
                }
            } catch (RuntimeException e) {
                // トークンが無効または失効している場合
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or expired token");
                return;
            }
        }

        // 次のフィルタに進む
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            logger.debug("Bearer token found in Authorization header");
            return bearerToken.substring(7);
        }
        logger.warn("No Authorization header or invalid format");
        return null;
    }
}

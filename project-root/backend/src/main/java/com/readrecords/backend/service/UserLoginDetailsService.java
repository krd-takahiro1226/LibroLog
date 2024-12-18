package com.readrecords.backend.service;

import com.readrecords.backend.entity.UserLogin;
import com.readrecords.backend.repository.UserLoginRepostoty;
import com.readrecords.backend.security.UserLoginDetails;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserLoginDetailsService implements UserDetailsService {
  private static final Logger logger = LoggerFactory.getLogger(UserLoginDetailsService.class);
  @Autowired UserLoginRepostoty userLoginRepostoty;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Optional<UserLogin> thisUser = userLoginRepostoty.findByUsername(username);
    logger.info("User found: " + thisUser);
    return thisUser
        .map(user -> new UserLoginDetails(user))
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }
}

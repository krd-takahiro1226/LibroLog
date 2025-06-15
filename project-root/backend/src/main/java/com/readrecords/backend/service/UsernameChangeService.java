package com.readrecords.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readrecords.backend.repository.UsernameChangeRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UsernameChangeService {
    private static final Logger logger = LoggerFactory
            .getLogger(UsernameChangeService.class);

    @Autowired
    UsernameChangeRepository usernameChangeRepository;

    public void changeUsername(String userId, String newUsername) {
        logger.info("Updating username for userId: {}", userId);

        int updatedRows = usernameChangeRepository.updateUsername(userId,
                newUsername);

        if (updatedRows == 0) {
            throw new IllegalArgumentException(
                    "User not found or username unchanged.");
        }
    }
}

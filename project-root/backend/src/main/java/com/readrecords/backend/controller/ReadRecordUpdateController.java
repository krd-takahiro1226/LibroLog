package com.readrecords.backend.controller;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.readrecords.backend.dto.UserReadRecordsDto;
//　import com.readrecords.backend.security.UserLoginDetails;
import com.readrecords.backend.service.ReadRecordsUpdateService;

@RestController
public class ReadRecordUpdateController {
    private final ReadRecordsUpdateService readRecordsUpdateService;
    private static final Logger logger = LoggerFactory.getLogger(ReadRecordUpdateController.class);

    public ReadRecordUpdateController(ReadRecordsUpdateService readRecordsUpdateService){
        this.readRecordsUpdateService = readRecordsUpdateService;
    }

    @PostMapping("/updateRecords")
        public ResponseEntity<?> updateRecords(
            @RequestBody List<UserReadRecordsDto> requestData,
            Authentication authentication) {
                // userid取得の方法に関しては、MunuControllerが役に立ちそう
                if (authentication == null || !authentication.isAuthenticated()) {
                   // logger.warn("Unauthorized access attempt");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access");
                }
                try{
                    String userId = authentication.getDetails().toString();
                    logger.info("Fetching records for userId: {}", userId);
                    readRecordsUpdateService.updateReadRecords(requestData, userId);
                    return ResponseEntity.ok("Records updated successfully");
                }catch(Exception e){
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: "+ e.getMessage());
                }

            }
}

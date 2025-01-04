package com.readrecords.backend.controller;

import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.readrecords.backend.service.ReadRecordsDeleteService;

@RestController
public class ReadRecordsDeleteController {
    private final ReadRecordsDeleteService readRecordsDeleteService;
    private static final Logger logger = LoggerFactory.getLogger(ReadRecordsDeleteController.class);

    public ReadRecordsDeleteController(ReadRecordsDeleteService readRecordsDeleteService){
        this.readRecordsDeleteService = readRecordsDeleteService;
    }

    @PostMapping("/deleteRecords")
        public ResponseEntity<?> deleteRecords(
            @RequestBody Map<String, List<String>> requestData,
            Authentication authentication){
                if (authentication == null || !authentication.isAuthenticated()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access");
                }
                try{
                    String userId = authentication.getDetails().toString();
                    logger.info("Fetching records for userId: {}", userId);
                    readRecordsDeleteService.deleteReadRecords(requestData.get("isbns"), userId);
                    return ResponseEntity.ok("Records Deleted successfully");
                }catch(Exception e){
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: "+ e.getMessage());
                }
            }
}

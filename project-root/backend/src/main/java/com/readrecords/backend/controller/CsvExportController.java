package com.readrecords.backend.controller;

import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readrecords.backend.service.CsvExportService;

@RestController
@RequestMapping("/exportRecords")
public class CsvExportController {

  private static final Logger logger = LoggerFactory.getLogger(CsvExportController.class);

  @Autowired
  private CsvExportService csvExportService;

  // CSVデータのエクスポート
  @GetMapping("/csv")
  public ResponseEntity<byte[]> exportCsv(Authentication authentication) {
    try {
      // ユーザIDの取得
      String userId = authentication.getDetails().toString();
      logger.info("CSV export requested for userId: {}", userId);

      // CSVデータを生成
      byte[] csvBytes = csvExportService.generateCsvData(userId);

      // HTTPヘッダーを設定
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
      headers.setContentDispositionFormData("attachment", "registered_books.csv");

      return ResponseEntity.ok()
          .headers(headers)
          .body(csvBytes);

    } catch (Exception e) {
      logger.error("CSV export failed for userId: {}", authentication.getDetails().toString(), e);
      return ResponseEntity.internalServerError().build();
    }
  }
}
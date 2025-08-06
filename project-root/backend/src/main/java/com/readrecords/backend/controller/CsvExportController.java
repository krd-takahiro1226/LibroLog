package com.readrecords.backend.controller;

import com.readrecords.backend.service.ReadingRecordsService;
import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
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

@RestController
@RequestMapping("/exportRecords")
public class CsvExportController {

  private static final Logger logger = LoggerFactory.getLogger(CsvExportController.class);

  @Autowired
  private ReadingRecordsService readingRecordsService;

  @GetMapping("/csv")
  public ResponseEntity<byte[]> exportCsv(Authentication authentication) {
    try {
      // ユーザIDの取得
      String userId = authentication.getDetails().toString();
      logger.info("CSV export requested for userId: {}", userId);

      // ユーザーの読書記録を取得
      List<Map<String, Object>> records = readingRecordsService.getRecordsByUserId(userId);

      // CSVデータを生成
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      PrintWriter writer = new PrintWriter(
          new OutputStreamWriter(outputStream, StandardCharsets.UTF_8));

      // CSVヘッダーを書き込み
      writer.println("ISBN,書籍名,著者,読み始めた日,読了日,優先度");

      // データを書き込み
      for (Map<String, Object> record : records) {
        String isbn = escapeCSV(String.valueOf(record.get("isbn")));
        String bookName = escapeCSV(String.valueOf(record.get("bookName")));
        String author = escapeCSV(String.valueOf(record.get("author")));
        String startDate = String.valueOf(record.get("startDate"));
        String endDate = String.valueOf(record.get("endDate"));
        Integer priority = (Integer) record.get("priority");
        String priorityText = convertPriorityToText(priority);

        writer.printf("%s,%s,%s,%s,%s,%s%n",
            isbn, bookName, author, startDate, endDate, priorityText);
      }

      writer.flush();
      writer.close();

      byte[] csvBytes = outputStream.toByteArray();

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

  private String escapeCSV(String value) {
    if (value == null) {
      return "";
    }
    // カンマや改行、ダブルクォートが含まれている場合はエスケープ
    if (value.contains(",") || value.contains("\n") || value.contains("\"")) {
      return "\"" + value.replace("\"", "\"\"") + "\"";
    }
    return value;
  }

  private String convertPriorityToText(Integer priority) {
    if (priority == null) {
      return "未分類";
    }
    switch (priority) {
      case 1:
        return "すぐ読みたい本";
      case 2:
        return "今後読みたい本";
      case 3:
        return "読んだことのある本";
      default:
        return "未分類";
    }
  }
}
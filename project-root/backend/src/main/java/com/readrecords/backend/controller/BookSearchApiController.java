package com.readrecords.backend.controller;

import com.readrecords.backend.client.BookSearchApiClient;
import com.readrecords.backend.dto.SearchBooksResponseDto;
import com.readrecords.backend.entity.BookRecords;
import com.readrecords.backend.entity.RegisterBookRecords;
import com.readrecords.backend.service.BookRecordsService;
import com.readrecords.backend.service.RegisterBookRecordsService;
import java.sql.Date;
import java.util.Calendar;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/searchBooks/sruSearch")
public class BookSearchApiController {
  private static final Logger logger = LoggerFactory
      .getLogger(BookSearchApiController.class);
  final String REGISTER_SUCCESS_MESSAGE = "successRegister";
  final String DUPLICATE_RECORD_MESSAGE = "duplicateRecord";
  @Autowired
  BookSearchApiClient bookSearchApiClient;

  @Autowired
  RegisterBookRecordsService readRecordsService;

  @Autowired
  BookRecordsService bookRecordsService;

  @GetMapping
  public ResponseEntity<SearchBooksResponseDto> showSearchWindow(
      @RequestParam(required = false) String title,
      @RequestParam(required = false) String author,
      @RequestParam(required = false) String publisherName,
      @RequestParam(required = false) String isbn,
      @RequestParam(value = "currentPage", defaultValue = "1") Integer currentPage,
      @RequestParam(value = "limit", defaultValue = "10") Integer limit) throws Exception {
    SearchBooksResponseDto response = bookSearchApiClient.getBookSearch(title,
        author, publisherName, isbn, currentPage, limit);
    int totalPages = response.getPageCount();
    response.setPageCount(totalPages);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/register")
  // TODO 画面が対応したら引数にread_countとpriority、memoを追加
  public ResponseEntity<?> registerRecords(
      @RequestBody Map<String, Object> requestData,
      Authentication authentication) {
    String ISBN = (String) requestData.get("isbn");
    String bookName = (String) requestData.get("title");
    String author = (String) requestData.get("author");
    String genre = (String) requestData.get("size");
    String publicationYear = (String) requestData.get("salesDate");
    String publisher = (String) requestData.get("publisherName");
    int priority = (int) requestData.get("selectedOption");
    // 登録成功可否
    String registerStatus;
    // ユーザIDの取得
    String userId = authentication.getDetails().toString();
    logger.info("Fetching records for userId: {}", userId);
    // 現在日付の取得(レコード登録用)
    Date date = new Date(Calendar.getInstance().getTimeInMillis());
    // 出版年のフォーマット変換
    String convertPublicationYear = convertPublicetionYear(publicationYear);
    // 登録情報一覧
    logger.info(
        "ISBN: {}, bookName: {}, author: {}, genre: {}, publicationYear: {}, publisher: {}",
        ISBN,
        bookName,
        author,
        genre,
        publicationYear,
        publisher);
    // 書籍情報の登録
    registerBoookRecords(ISBN, bookName, author, genre, convertPublicationYear,
        publisher);
    // 読書情報の登録
    registerStatus = registerReadRecords(userId, ISBN, date, date, 1, priority,
        null);
    // TODO 本来は検索結果画面にリダイレクトして他の本の登録とかもしたいはずだが、現状できていない
    if (registerStatus.equals(REGISTER_SUCCESS_MESSAGE)) {
      return ResponseEntity.ok("200");
    } else if (registerStatus.equals(DUPLICATE_RECORD_MESSAGE)) {
      return ResponseEntity.ok("400");
    } else {
      return ResponseEntity.ok("500");
    }
  }

  private void registerBoookRecords(
      String ISBN,
      String bookName,
      String author,
      String genre,
      String publicationYear,
      String publisher) {
    BookRecords bookRecords = new BookRecords();
    bookRecords.setISBN(ISBN);
    bookRecords.setBookName(bookName);
    bookRecords.setAuthor(author);
    bookRecords.setGenre(genre);
    bookRecords.setPublicationYear(publicationYear);
    bookRecords.setPublisher(publisher);

    bookRecordsService.registerBookRecords(
        bookRecords.getISBN(),
        bookRecords.getBookName(),
        bookRecords.getAuthor(),
        bookRecords.getGenre(),
        bookRecords.getPublicationYear().toString(),
        bookRecords.getPublisher());
  }

  private String registerReadRecords(
      String userId,
      String ISBN,
      Date startDate,
      Date endDate,
      int readCount,
      int priority,
      String memo) {
    RegisterBookRecords readRecords = new RegisterBookRecords();
    readRecords.setISBN(ISBN);
    readRecords.setUserId(userId);
    readRecords.setStartDate(startDate);
    readRecords.setEndDate(endDate);
    readRecords.setReadCount(readCount);
    readRecords.setPriority(priority);
    readRecords.setMemo(memo);
    // 読書情報の登録
    String message = readRecordsService.registerReadRecords(
        readRecords.getISBN(),
        readRecords.getUserId(),
        readRecords.getStartDate().toString(),
        readRecords.getEndDate().toString(),
        readRecords.getReadCount(),
        readRecords.getPriority(),
        readRecords.getMemo());
    return message;
  }

  private String convertPublicetionYear(String publicationYear) {
    publicationYear = publicationYear.replace("年", "-");
    publicationYear = publicationYear.replace("月", "-");
    if (publicationYear.contains("日頃")) {
      // 末尾2文字を削除する
      publicationYear = publicationYear.substring(0,
          publicationYear.length() - 2);
    } else if (publicationYear.contains("日")) {
      // 末尾1文字を削除する
      publicationYear = publicationYear.substring(0,
          publicationYear.length() - 1);
    } else {
      // 日付が存在しない時、仮で日付を設定する
      publicationYear = publicationYear += "-01";
    }
    return publicationYear;
  }
}

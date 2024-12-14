package com.readrecords.backend.controller;

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

import com.readrecords.backend.client.BookSearchApiClient;
import com.readrecords.backend.dto.SearchBooksResponseDto;
import com.readrecords.backend.entity.BookRecords;
import com.readrecords.backend.entity.ReadRecords;
import com.readrecords.backend.service.BookRecordsService;
import com.readrecords.backend.service.ReadRecordsService;

@RestController
@RequestMapping(value = "/searchBooks/sruSearch")
public class BookSearchApiController {
  private static final Logger logger = LoggerFactory.getLogger(BookSearchApiController.class);
  final String REGISTER_SUCCESS_MESSAGE = "successRegister";
  final String DUPLICATE_RECORD_MESSAGE = "duplicateRecord";
  @Autowired
  BookSearchApiClient bookSearchApiClient;

  @Autowired
  ReadRecordsService readRecordsService;

  @Autowired
  BookRecordsService bookRecordsService;

  @GetMapping
  public ResponseEntity<SearchBooksResponseDto> showSearchWindow(@RequestParam(required = false) String title, 
  @RequestParam(required = false) String author, @RequestParam(required = false) String publisherName, 
  @RequestParam(required = false) String isbn,
  @RequestParam(value = "page", defaultValue = "1") Integer page) throws Exception{
    SearchBooksResponseDto response = bookSearchApiClient.getBookSearch(title, author, publisherName, isbn, page);
    System.out.println(response);
    return ResponseEntity.ok(response);
}

@PostMapping("/register")
// TODO 画面が対応したら引数にread_countとpriority、memoを追加
    public ResponseEntity<?> registerRecords(@RequestBody Map<String, Object> requestData, Authentication authentication){
    String ISBN = (String) requestData.get("isbn");
    String book_name = (String) requestData.get("title");
    String author = (String) requestData.get("author");
    String genre = (String) requestData.get("size");
    String publication_year = (String) requestData.get("salesDate");
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
    String convertPublicationYear = convertPublicetionYear(publication_year);
    // 登録情報一覧
    logger.info("ISBN: {}, book_name: {}, author: {}, genre: {}, publication_year: {}, publisher: {}", ISBN, book_name, author, genre, publication_year, publisher);
    // 書籍情報の登録
    registerBoookRecords(ISBN, book_name, author, genre, convertPublicationYear, publisher);
    // 読書情報の登録
    registerStatus = registerReadRecords(userId, ISBN, date, date, 1, priority, null);
    // TODO 本来は検索結果画面にリダイレクトして他の本の登録とかもしたいはずだが、現状できていない
    if (registerStatus.equals(REGISTER_SUCCESS_MESSAGE)) {
      return ResponseEntity.ok("200");
    }
    else if (registerStatus.equals(DUPLICATE_RECORD_MESSAGE)) {
      return ResponseEntity.ok("400");
    }
    else {
      return ResponseEntity.ok("500");
    }
  }

  private void registerBoookRecords(String ISBN, String book_name, String author, String genre, String publication_year, String publisher) {
    BookRecords bookRecords = new BookRecords();
    bookRecords.setISBN(ISBN);
    bookRecords.setBook_name(book_name);
    bookRecords.setAuthor(author);
    bookRecords.setGenre(genre);
    bookRecords.setPublication_year(publication_year);
    bookRecords.setPublisher(publisher);

    bookRecordsService.registerBookRecords(bookRecords.getISBN(), bookRecords.getBook_name(), bookRecords.getAuthor(), bookRecords.getGenre(), bookRecords.getPublication_year().toString(), bookRecords.getPublisher());  
  }

  private String registerReadRecords(String userId, String ISBN, Date start_date, Date end_date, int read_count, int priority, String memo) {
    ReadRecords readRecords = new ReadRecords();
    readRecords.setISBN(ISBN);
    readRecords.setUser_id(userId);
    readRecords.setStart_date(start_date);
    readRecords.setEnd_date(end_date);
    readRecords.setRead_count(read_count);
    readRecords.setPriority(priority);
    readRecords.setMemo(memo);
    // 読書情報の登録
    String message = readRecordsService.registerReadRecords(readRecords.getISBN(), readRecords.getUser_id(), readRecords.getStart_date().toString(), readRecords.getEnd_date().toString(), readRecords.getRead_count(), readRecords.getPriority(), readRecords.getMemo());
    return message;
  }

  private String convertPublicetionYear(String publication_year) {
    publication_year = publication_year.replace("年", "-");
    publication_year = publication_year.replace("月", "-");
    if (publication_year.contains("日頃")) {
      // 末尾2文字を削除する
      publication_year = publication_year.substring(0, publication_year.length() - 2);
    }
    else if (publication_year.contains("日")) {
      // 末尾1文字を削除する
      publication_year = publication_year.substring(0, publication_year.length() - 1);
    }
    else{
      // 日付が存在しない時、仮で日付を設定する
      publication_year = publication_year += "-01";
    }
    return publication_year;
}

}

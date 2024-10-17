package com.readrecords.backend.controller;

import java.sql.Date;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.readrecords.backend.client.BookSearchApiClient;
import com.readrecords.backend.dto.SearchBooksResponseDto;
import com.readrecords.backend.entity.BookRecords;
import com.readrecords.backend.entity.ReadRecords;
import com.readrecords.backend.security.UserLoginDetails;
import com.readrecords.backend.service.BookRecordsService;
import com.readrecords.backend.service.ReadRecordsService;

@Controller
@RequestMapping(value = "/searchBooks/sruSearch")
public class BookSearchApiController {
  final String REGISTER_SUCCESS_MESSAGE = "successRegister";
  final String DUPLICATE_RECORD_MESSAGE = "duplicateRecord";
  @Autowired
  BookSearchApiClient bookSearchApiClient;

  @Autowired
  ReadRecordsService readRecordsService;

  @Autowired
  BookRecordsService bookRecordsService;

  @GetMapping
  public String showSearchWindow(@RequestParam String title, @RequestParam String author, @RequestParam String publisherName,@RequestParam String isbn, Model model) throws Exception{
    SearchBooksResponseDto response = bookSearchApiClient.getBookSearch(title, author, publisherName,isbn);
    model.addAttribute("response", response);
    return "searchResults";
}

@PostMapping
// TODO 画面が対応したら引数にread_countとpriority、memoを追加
  public String registerRecords(@RequestParam("isbn") String ISBN, @RequestParam("title") String book_name,
      @RequestParam("author") String author, @RequestParam("size") String genre, 
      @RequestParam("salesDate") String publication_year, @RequestParam("publisherName") String publisher,
      Model model){
    // 登録成功可否
    String registerStatus;
    // ユーザIDの取得
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserLoginDetails userDetails = (UserLoginDetails) authentication.getPrincipal();
    String userId = userDetails.getUserId();
    // 現在日付の取得(レコード登録用)
    Date date = new Date(Calendar.getInstance().getTimeInMillis());
    // 出版年のフォーマット変換
    String convertPublicationYear = convertPublicetionYear(publication_year);
    // 書籍情報の登録
    registerBoookRecords(ISBN, book_name, author, genre, convertPublicationYear, publisher);
    // 読書情報の登録
    registerStatus = registerReadRecords(userId, ISBN, date, date, 1, 1, "memo");
    switch (registerStatus) {
      case REGISTER_SUCCESS_MESSAGE:
        model.addAttribute("registerStatus", "書籍情報が正常に登録されました");
        break;
      case DUPLICATE_RECORD_MESSAGE:
        model.addAttribute("registerStatus", "書籍情報が既に登録されています");
        break;
    }
    // TODO 本来は検索結果画面にリダイレクトして他の本の登録とかもしたいはずだが、現状できていない
    return "redirect:/searchBooks";
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
    return publication_year;
}

}

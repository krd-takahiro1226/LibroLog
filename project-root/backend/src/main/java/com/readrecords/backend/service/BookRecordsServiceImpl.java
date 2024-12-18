package com.readrecords.backend.service;

import com.readrecords.backend.entity.BookRecords;
import com.readrecords.backend.repository.BookRecordsRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class BookRecordsServiceImpl implements BookRecordsService {
  @Autowired BookRecordsRepository bookRecordsRepository;

  @Override
  public void registerBookRecords(
      String ISBN,
      String book_name,
      String author,
      String genre,
      String publication_year,
      String publisher) {
    List<BookRecords> bookRecords = bookRecordsRepository.getBookRecordsByISBN(ISBN);
    if (bookRecords.isEmpty()) {
      // 登録されていなければ、書籍情報を登録、登録されていれば何もしない
      bookRecordsRepository.insertBookRecords(
          ISBN, book_name, author, genre, publication_year, publisher);
    }
  }
}

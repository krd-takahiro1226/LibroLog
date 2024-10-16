package com.readrecords.backend.service;

public interface BookRecordsService {
  public void registerBookRecords(String ISBN, String book_name, String author, String genre, String publication_year, String publisher);
} 

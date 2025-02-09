package com.readrecords.backend.client;

import com.readrecords.backend.dto.SearchBooksResponseDto;
import org.springframework.stereotype.Service;

@Service
public interface BookSearchApiClient {
  public SearchBooksResponseDto getBookSearch(
      String title, String creator, String publisherName, String isbn,
      Integer page)
      throws Exception;
}

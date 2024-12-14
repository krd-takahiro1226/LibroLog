package com.readrecords.backend.client;

import org.springframework.stereotype.Service;

import com.readrecords.backend.dto.SearchBooksResponseDto;

@Service
public interface BookSearchApiClient {
    public SearchBooksResponseDto getBookSearch(String title, String creator, String publisherName, String isbn,
            Integer page) throws Exception;
}

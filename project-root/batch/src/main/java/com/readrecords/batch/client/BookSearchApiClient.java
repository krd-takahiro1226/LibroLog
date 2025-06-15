package com.readrecords.batch.client;

import com.readrecords.batch.dto.SearchSalesDateResponseDto;
import java.util.List;

public interface BookSearchApiClient {
    public List<SearchSalesDateResponseDto> getBookSearchByAuthor(String author) throws Exception;
}

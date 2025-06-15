package com.readrecords.batch.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.readrecords.batch.dto.SearchSalesDateResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookSearchApiClientImpl implements BookSearchApiClient {

    @Value("${key.api}")
    private String applicationId;

    private static final String BASE_URL = "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<SearchSalesDateResponseDto> getBookSearchByAuthor(String author) throws Exception {
        if (author == null || author.isBlank()) {
            throw new IllegalArgumentException("検索条件を入力してください");
        }

        URI uri = UriComponentsBuilder
                .fromUriString(BASE_URL)
                .queryParam("applicationId", applicationId)
                .queryParam("format", "json")
                .queryParam("author", author)
                .queryParam("sort", "-releaseDate")
                .encode(StandardCharsets.UTF_8)
                .build()
                .toUri();

        HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");

        if (conn.getResponseCode() != 200) {
            throw new RuntimeException("HTTP error code : " + conn.getResponseCode());
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line);
            }

            var rootNode = objectMapper.readTree(response.toString());
            var itemsNode = rootNode.path("Items");

            List<SearchSalesDateResponseDto> result = new ArrayList<>();
            if (itemsNode.isArray()) {
                for (var itemNode : itemsNode) {
                    var dto = itemNode.path("Item").traverse(objectMapper)
                            .readValueAs(SearchSalesDateResponseDto.class);
                    result.add(dto);
                }
            }
            return result;
        } finally {
            conn.disconnect();
        }
    }
}

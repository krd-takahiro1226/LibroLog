package com.readrecords.batch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
// 存在しない変数を無視してマッピング
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchSalesDateResponseDto {
    @JsonProperty("title")
    private String title;

    @JsonProperty("author")
    private String author;

    @JsonProperty("isbn")
    private String isbn;

    @JsonProperty("salesDate")
    private String salesDate;

    @JsonProperty("itemUrl")
    private String itemUrl;

    @JsonProperty("itemPrice")
    private int itemPrice;
    
    //　メール　　smallImageUrl
}

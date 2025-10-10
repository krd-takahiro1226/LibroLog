package com.readrecords.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Mailjet コンタクト情報のデータクラス
 */
public class MailjetContactDto {
    @JsonProperty("Email")
    public String email;

    @JsonProperty("Name")
    public String name;

    public MailjetContactDto() {}

    public MailjetContactDto(String email, String name) {
        this.email = email;
        this.name = name;
    }
}
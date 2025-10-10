package com.readrecords.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Mailjet API リクエストのデータクラス
 */
public class MailjetRequestDto {
    @JsonProperty("Messages")
    public List<MailjetMessageDto> messages;
}
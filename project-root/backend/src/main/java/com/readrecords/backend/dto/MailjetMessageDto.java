package com.readrecords.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Mailjet メッセージのデータクラス
 */
public class MailjetMessageDto {
    @JsonProperty("From")
    public MailjetContactDto from;

    @JsonProperty("To")
    public List<MailjetContactDto> to;

    @JsonProperty("Subject")
    public String subject;

    @JsonProperty("TextPart")
    public String textPart;

    @JsonProperty("HTMLPart")
    public String htmlPart;
}
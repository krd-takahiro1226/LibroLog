package com.readrecords.backend.service;

import org.springframework.data.domain.Page;

import com.readrecords.backend.dto.UserReadRecordsDto;

public interface RegisterBookRecordsService {
  public Page<UserReadRecordsDto> getReadRecordsByUserId(String userId, int page, int limit);
  public String registerReadRecords(
      String ISBN,
      String user_id,
      String start_date,
      String end_date,
      int read_count,
      int priority,
      String memo);
}

package com.readrecords.backend.service;

import com.readrecords.backend.dto.UserReadRecordsDto;
import java.util.List;

public interface ReadRecordsService {
  public List<UserReadRecordsDto> getReadRecordsByUserId(String user_id);

  public String registerReadRecords(
      String ISBN,
      String user_id,
      String start_date,
      String end_date,
      int read_count,
      int priority,
      String memo);
}

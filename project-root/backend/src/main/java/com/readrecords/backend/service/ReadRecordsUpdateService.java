package com.readrecords.backend.service;

import com.readrecords.backend.dto.UserReadRecordsDto;
import java.util.List;

public interface ReadRecordsUpdateService {
  void updateReadRecords(List<UserReadRecordsDto> updateRequestDtos, String userId);
}

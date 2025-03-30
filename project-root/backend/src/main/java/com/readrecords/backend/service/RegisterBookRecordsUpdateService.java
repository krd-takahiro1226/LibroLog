package com.readrecords.backend.service;

import com.readrecords.backend.dto.UserReadRecordsDto;
import java.util.List;

public interface RegisterBookRecordsUpdateService {
  void updateReadRecords(List<UserReadRecordsDto> updateRequestDtos, String userId);
}

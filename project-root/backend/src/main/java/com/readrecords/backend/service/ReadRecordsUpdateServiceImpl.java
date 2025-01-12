package com.readrecords.backend.service;

import com.readrecords.backend.dto.UserReadRecordsDto;
import com.readrecords.backend.repository.ReadRecordsUpdateRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ReadRecordsUpdateServiceImpl implements ReadRecordsUpdateService {
  // コンストラクタの依存性注入 (DI)
  private final ReadRecordsUpdateRepository readRecordsUpdateRepository;

  public ReadRecordsUpdateServiceImpl(ReadRecordsUpdateRepository readRecordsUpdateRepository) {
    this.readRecordsUpdateRepository = readRecordsUpdateRepository;
  }

  @Override
  @Transactional
  public void updateReadRecords(List<UserReadRecordsDto> updateRequestDtos, String userId) {
    for (UserReadRecordsDto request : updateRequestDtos) {
      // Todo UserReadRecordsDtoの表現より、スネークケースとキャメルケースが混在
      Optional<Integer> optionalRecordId =
          readRecordsUpdateRepository.findRecordIdByIsbnAndUserId(request.getISBN(), userId);
      if (optionalRecordId.isPresent()) {
        Integer recordId = optionalRecordId.get();
        readRecordsUpdateRepository.updateReadRecords(
            recordId, request.getStart_date(), request.getEnd_date(), request.getPriority());
      } else {
        throw new RuntimeException("Record not found for ISBN: " + request.getISBN());
      }
    }
  }
}

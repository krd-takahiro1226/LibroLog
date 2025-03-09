package com.readrecords.backend.service;

import com.readrecords.backend.dto.UserReadRecordsDto;
import com.readrecords.backend.entity.RegisterBookRecords;
import com.readrecords.backend.repository.RegisterBookRecordsRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class RegisterBookRecordsServiceImpl
    implements RegisterBookRecordsService {
  final String REGISTER_SUCCESS_MESSAGE = "successRegister";
  final String DUPLICATE_RECORD_MESSAGE = "duplicateRecord";
  @Autowired
  RegisterBookRecordsRepository registerBookRecordsRepository;

  @Override
  public Page<UserReadRecordsDto> getReadRecordsByUserId(String user_id, int page, int limit) {
    PageRequest pageable = PageRequest.of(page - 1, limit); // Spring Data JPA のページングは 0 ベース
    return registerBookRecordsRepository.getReadRecordsByUserId(user_id, pageable);
  }

  @Override
  public String registerReadRecords(
      String ISBN,
      String user_id,
      String start_date,
      String end_date,
      int read_count,
      int priority,
      String memo) {
    String message;
    List<RegisterBookRecords> readRecords = registerBookRecordsRepository
        .getReadRecordsByISBNandUserId(ISBN, user_id);
    if (readRecords.isEmpty()) {
      // 読書情報を登録
      registerBookRecordsRepository.insertReadRecords(
          ISBN, user_id, start_date, null, read_count, priority, memo);
      message = REGISTER_SUCCESS_MESSAGE;
    } else {
      // 既に登録済みであることを通知
      message = REGISTER_SUCCESS_MESSAGE;
    }
    return message;
  }
}

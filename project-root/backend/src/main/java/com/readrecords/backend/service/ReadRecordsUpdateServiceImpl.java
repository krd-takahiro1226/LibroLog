package com.readrecords.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readrecords.backend.dto.UserReadRecordsDto;
import com.readrecords.backend.repository.ReadRecordsUpdateRepository;

import jakarta.transaction.Transactional;

@Service
public class ReadRecordsUpdateServiceImpl implements ReadRecordsUpdateService {
  @Autowired
  ReadRecordsUpdateRepository readRecordsUpdateRepository;

  @Override
  @Transactional
  public void updateReadRecords(List<UserReadRecordsDto> updateRequestDtos,
      String userId) {
    for (UserReadRecordsDto request : updateRequestDtos) {
      Optional<Integer> optionalRecordId = readRecordsUpdateRepository
          .findRecordIdByIsbnAndUserId(request.getISBN(), userId);
      if (optionalRecordId.isPresent()) {
        Integer recordId = optionalRecordId.get();
        readRecordsUpdateRepository.updateReadRecords(
            recordId, request.getStartDate(), request.getEndDate(),
            request.getPriority());
      } else {
        throw new RuntimeException(
            "Record not found for ISBN: " + request.getISBN());
      }
    }
  }
}

package com.readrecords.backend.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readrecords.backend.dto.UserReadRecordsDto;
import com.readrecords.backend.entity.ReadRecords;
import com.readrecords.backend.repository.ReadRecordsRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ReadRecordsServiceImpl implements ReadRecordsService {
    final String REGISTER_SUCCESS_MESSAGE = "successRegister";
    final String DUPLICATE_RECORD_MESSAGE = "duplicateRecord";
    @Autowired
    ReadRecordsRepository readRecordsRepository;

    @Override
    public List<UserReadRecordsDto> getReadRecordsByUserId(String user_id) {
        Iterator<UserReadRecordsDto> iterator = readRecordsRepository.getReadRecordsByUserId(user_id).iterator();
        List<UserReadRecordsDto> userReadRecords = new ArrayList<>();
        while (iterator.hasNext()) {
            UserReadRecordsDto userReadRecord = iterator.next();
            userReadRecords.add(userReadRecord);
        }
        return userReadRecords;
    }

    @Override
    public String registerReadRecords(String ISBN, String user_id, String start_date, String end_date, int read_count,
            int priority, String memo) {
        String message;
        List<ReadRecords> readRecords = readRecordsRepository.getReadRecordsByISBNandUserId(ISBN, user_id);
        if (readRecords.isEmpty()) {
            // 読書情報を登録
            readRecordsRepository.insertReadRecords(ISBN, user_id, start_date, null, read_count, priority, memo);
            message = REGISTER_SUCCESS_MESSAGE;
        } else {
            // 既に登録済みであることを通知
            message = REGISTER_SUCCESS_MESSAGE;
        }
        return message;
    }
}

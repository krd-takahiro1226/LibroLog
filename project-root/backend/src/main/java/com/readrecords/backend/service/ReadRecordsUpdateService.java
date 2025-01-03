package com.readrecords.backend.service;

import java.util.List;

import com.readrecords.backend.dto.UserReadRecordsDto;

public interface ReadRecordsUpdateService {
    void updateReadRecords(List<UserReadRecordsDto> updateRequestDtos, String userId);
}

package com.readrecords.backend.service;

import java.util.List;

public interface ReadRecordsDeleteService {
    void deleteReadRecords(List<String> ISBNs, String userId);
}

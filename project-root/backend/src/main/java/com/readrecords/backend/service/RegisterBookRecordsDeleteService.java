package com.readrecords.backend.service;

import java.util.List;

public interface RegisterBookRecordsDeleteService {
  void deleteReadRecords(List<String> ISBNs, String userId);
}

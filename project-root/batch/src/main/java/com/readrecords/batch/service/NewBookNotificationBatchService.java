package com.readrecords.batch.service;

public interface NewBookNotificationBatchService {
    void fetchUsers();
    void fetchFollowAuthors();
    void fetchAndFilterBooks();
    void notifyResults();
}

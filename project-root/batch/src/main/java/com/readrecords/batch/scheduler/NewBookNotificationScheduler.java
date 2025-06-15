package com.readrecords.batch.scheduler;

import com.readrecords.batch.service.NewBookNotificationBatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NewBookNotificationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(NewBookNotificationScheduler.class);
    private final NewBookNotificationBatchService batchService;

    public NewBookNotificationScheduler(NewBookNotificationBatchService batchService) {
        this.batchService = batchService;
    }

    @Scheduled(cron = "0 */5 * * * *", zone = "Asia/Tokyo")  // ← ここを設定
    public void runBatch() {
        logger.info("バッチ処理を開始（5分ごと）");

        batchService.fetchUsers();
        batchService.fetchFollowAuthors();
        batchService.fetchAndFilterBooks();
        batchService.notifyResults();

        logger.info("バッチ処理を終了");
    }
}
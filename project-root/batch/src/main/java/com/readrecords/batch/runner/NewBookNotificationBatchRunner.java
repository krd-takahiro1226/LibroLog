package com.readrecords.batch.runner;

import com.readrecords.batch.service.NewBookNotificationBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class NewBookNotificationBatchRunner implements ApplicationRunner {

    private final NewBookNotificationBatchService newBookNotificationBatchService;

    @Autowired
    public NewBookNotificationBatchRunner(NewBookNotificationBatchService newBookNotificationBatchService) {
        this.newBookNotificationBatchService = newBookNotificationBatchService;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // オプション引数の取得例
        if (args.containsOption("run")) {
            System.out.println("バッチ実行開始");

            newBookNotificationBatchService.fetchUsers();
            newBookNotificationBatchService.fetchFollowAuthors();
            newBookNotificationBatchService.fetchAndFilterBooks();
            newBookNotificationBatchService.notifyResults();

            System.out.println("バッチ実行完了");
        } else {
            System.out.println("オプション 'run' が指定されていないため、何も実行しませんでした");
        }
    }
}

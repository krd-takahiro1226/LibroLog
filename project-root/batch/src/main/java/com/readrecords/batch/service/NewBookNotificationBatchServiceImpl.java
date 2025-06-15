package com.readrecords.batch.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.readrecords.batch.client.BookSearchApiClient;
import com.readrecords.batch.dto.SearchSalesDateResponseDto;
import com.readrecords.batch.entity.FollowAuthor;
import com.readrecords.batch.entity.Users;
import com.readrecords.batch.repository.FollowAuthorRepository;
import com.readrecords.batch.repository.UsersRepository;

// // 通知用
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.fasterxml.jackson.databind.SerializationFeature;

@Service
public class NewBookNotificationBatchServiceImpl implements NewBookNotificationBatchService {
    private final UsersRepository usersRepository;
    private final FollowAuthorRepository followAuthorRepository;
    private final BookSearchApiClient bookSearchApiClient;
    private static final Logger logger = LoggerFactory.getLogger(NewBookNotificationBatchServiceImpl.class);

    private List<Users> users;
    private final Map<String, List<FollowAuthor>> userAuthors = new HashMap<>();
    private final Map<String, List<SearchSalesDateResponseDto>> userBooks = new HashMap<>();

    public NewBookNotificationBatchServiceImpl(UsersRepository usersRepository,
                                          FollowAuthorRepository followAuthorRepository,
                                          BookSearchApiClient bookSearchApiClient) {
        this.usersRepository = usersRepository;
        this.followAuthorRepository = followAuthorRepository;
        this.bookSearchApiClient = bookSearchApiClient;
    }

    // ユーザ一覧を取得
    @Override
    public void fetchUsers() {
        this.users = usersRepository.findAll();
    }

    // 各ユーザのフォロー著者リストを取得
    @Override
    public void fetchFollowAuthors() {
        for (Users user : users) {
            List<FollowAuthor> authors = followAuthorRepository.findByUserIdAndIsActiveTrue(user.getUserId());
            userAuthors.put(user.getUserId(), authors);
        }
    }

    // 書籍を取得し、発売日と著者名でフィルタリング
    @Override
    public void fetchAndFilterBooks() {
        LocalDate today = LocalDate.now();
        LocalDate oneMonthAgo = today.minusDays(30);

        for (Users user : users) {
            List<SearchSalesDateResponseDto> newBooks = new ArrayList<>();
            List<FollowAuthor> authors = userAuthors.get(user.getUserId());
            if (authors == null) continue;

            for (FollowAuthor author : authors) {
                List<SearchSalesDateResponseDto> books = fetchBooksWithRetry(author.getAuthorName(), user.getUserId());
                logger.debug("Fetched {} books for userId={}, author={}", books.size(), user.getUserId(), author.getAuthorName());

                for (SearchSalesDateResponseDto dto : books) {
                    boolean matchedAuthor = isAuthorMatching(author.getAuthorName(), dto.getAuthor());
                    boolean matchedDate = isWithinLastMonth(dto.getSalesDate(), oneMonthAgo, today);

                    if (!matchedDate) {
                        logger.info("Filtered out by date: userId={}, author={}, title={}, salesDate={}",
                            user.getUserId(), dto.getAuthor(), dto.getTitle(), dto.getSalesDate());
                    }
                    if (!matchedAuthor) {
                        logger.info("Filtered out by author: userId={}, expectedAuthor={}, actualAuthor={}, title={}",
                            user.getUserId(), author.getAuthorName(), dto.getAuthor(), dto.getTitle());
                    }

                    if (matchedAuthor && matchedDate) {
                        newBooks.add(dto);
                    }
                }
            }
            logger.info("userId={}, matchedNewBookCount={}", user.getUserId(), newBooks.size());
            userBooks.put(user.getUserId(), newBooks);
        }
    }
        // 著者名がAPIレスポンスに含まれているかチェック（部分一致）
    private boolean isAuthorMatching(String registeredAuthor, String apiAuthor) {
        boolean match = apiAuthor != null && apiAuthor.contains(registeredAuthor);
        logger.debug("Checking match: DB='{}' vs API='{}' → {}", registeredAuthor, apiAuthor, match); // ←追加
        return match;
    }

        // API呼び出しをリトライ付きで実施
    private List<SearchSalesDateResponseDto> fetchBooksWithRetry(String authorName, String userId) {
        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                Thread.sleep(3000);
                return bookSearchApiClient.getBookSearchByAuthor(authorName);
            } catch (Exception e) {
                if (attempt == 3) {
                    logger.warn("userId={}, author={}, error={}", userId, authorName, e.getMessage());
                }
            }
        }
        return Collections.emptyList();
    }

    // @Override
    // public void notifyResults() {
    //     for (Users user : users) {
    //         List<SearchSalesDateResponseDto> books = userBooks.get(user.getUserId());
    //         logger.info("userId={}, newBookCount={}", user.getUserId(), books != null ? books.size() : 0);
    //         System.out.printf("INFO: userId=%s, newBookCount=%d",
    //                 user.getUserId(), books != null ? books.size() : 0);
    //     }
    // }

    // ユーザーごとの通知結果をログ出力
    @Override
    public void notifyResults() {
        ObjectMapper objectMapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        for (Users user : users) {
            List<SearchSalesDateResponseDto> books = userBooks.get(user.getUserId());
            logger.info("userId={}, newBookCount={}", user.getUserId(), books != null ? books.size() : 0);
            if (books == null || books.isEmpty()) {
                logger.info("userId={}, newBookCount=0", user.getUserId());
                continue;
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", user.getUserId());
            payload.put("newBooks", books);

            try {
                String json = objectMapper.writeValueAsString(payload);
                logger.info("Notification payload:\n{}", json);
                System.out.println("Notification payload:\n" + json);
            } catch (Exception e) {
                logger.error("Failed to serialize notification payload for userId={}", user.getUserId(), e);
            }
        }
    }
    // 発売日が1ヶ月以内かチェック
    private boolean isWithinLastMonth(String salesDate, LocalDate oneMonthAgo, LocalDate today) {
        try {
            LocalDate parsed = parseSalesDate(salesDate);
            return !parsed.isBefore(oneMonthAgo) && !parsed.isAfter(today);
        } catch (Exception e) {
            logger.warn("Failed to parse date: {}", e.getMessage());
            return false;
        }
    }

    // 文字列からLocalDateに変換（形式に応じて柔軟に対応）
    private LocalDate parseSalesDate(String salesDate) {
        String normalized = salesDate.replace("頃", "").replace("予定", "").replace("（予定）", "");

        if (normalized.matches("\\d{4}年\\d{2}月\\d{2}日")) {
            return LocalDate.parse(normalized, DateTimeFormatter.ofPattern("yyyy年MM月dd日"));
        } else if (normalized.matches("\\d{4}年\\d{2}月")) {
            return LocalDate.parse(normalized + "01日", DateTimeFormatter.ofPattern("yyyy年MM月dd日"));
        } else if (normalized.matches("\\d{4}年")) {
            return LocalDate.parse(normalized + "01月01日", DateTimeFormatter.ofPattern("yyyy年MM月dd日"));
        }

        throw new IllegalArgumentException("不明な形式: " + salesDate);
    }
}

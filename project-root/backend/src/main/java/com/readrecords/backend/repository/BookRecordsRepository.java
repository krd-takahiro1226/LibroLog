package com.readrecords.backend.repository;

import com.readrecords.backend.entity.BookRecords;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRecordsRepository
                extends CrudRepository<BookRecords, String> {
        @Modifying
        @Transactional
        @Query(value = "insert into book_records "
                        + "(ISBN, book_name, author, genre, publication_year, publisher, image_url) values "
                        + "(:ISBN, :book_name, :author, :genre, :publication_year, :publisher, :image_url)", nativeQuery = true)
        void insertBookRecords(
                        @Param("ISBN") String ISBN,
                        @Param("book_name") String book_name,
                        @Param("author") String author,
                        @Param("genre") String genre,
                        @Param("publication_year") String publication_year,
                        @Param("publisher") String publisher,
                        @Param("image_url") String image_url);

        @Query(value = "select * from "
                        + "book_records where ISBN = :ISBN", nativeQuery = true)
        List<BookRecords> getBookRecordsByISBN(@Param("ISBN") String ISBN);

        @Query(value = "select br.ISBN, br.book_name, br.author, br.genre, br.publication_year, br.publisher from "
                        + "book_records br JOIN reading_records rr ON br.ISBN = rr.ISBN where rr.goal_id = :goal_id", nativeQuery = true)
        List<BookRecords> getBookRecordsByISBNAndGoalId(
                        @Param("goal_id") String goalId);

        @Query(value = "SELECT rbr.ISBN as isbn, br.book_name as bookName, br.author as author, " +
                       "rbr.start_date as startDate, rbr.end_date as endDate, rbr.priority as priority " +
                       "FROM register_book_records rbr " +
                       "JOIN book_records br ON rbr.ISBN = br.ISBN " +
                       "WHERE rbr.user_id = :userId " +
                       "ORDER BY rbr.start_date DESC", nativeQuery = true)
        List<Map<String, Object>> getRecordsForCsvExport(@Param("userId") String userId);
}

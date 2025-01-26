package com.readrecords.backend.repository;

import com.readrecords.backend.entity.BookRecords;
import jakarta.transaction.Transactional;
import java.util.List;
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
                        + "(ISBN, book_name, author, genre, publication_year, publisher) values "
                        + "(:ISBN, :book_name, :author, :genre, :publication_year, :publisher)", nativeQuery = true)
        void insertBookRecords(
                        @Param("ISBN") String ISBN,
                        @Param("book_name") String book_name,
                        @Param("author") String author,
                        @Param("genre") String genre,
                        @Param("publication_year") String publication_year,
                        @Param("publisher") String publisher);

        @Query(value = "select * from "
                        + "book_records where ISBN = :ISBN", nativeQuery = true)
        List<BookRecords> getBookRecordsByISBN(@Param("ISBN") String ISBN);
}

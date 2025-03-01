package com.readrecords.backend.repository;

import com.readrecords.backend.dto.UserReadRecordsDto;

import com.readrecords.backend.entity.RegisterBookRecords;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface RegisterBookRecordsRepository
        extends CrudRepository<RegisterBookRecords, Integer> {
        @Query("SELECT new com.readrecords.backend.dto.UserReadRecordsDto(r.ISBN, b.bookName, b.author, r.startDate, r.endDate, r.readCount, r.priority, r.memo) " +
                "FROM RegisterBookRecords r " +
                "JOIN BookRecords b ON r.ISBN = b.ISBN " +
                "WHERE r.userId = :userId")
        Page<UserReadRecordsDto> getReadRecordsByUserId(@Param("userId") String userId, Pageable pageable);

            
        @Query(value = "select * from " + "register_book_records where ISBN = :ISBN"
                + " and user_id = :user_id", nativeQuery = true)
        List<RegisterBookRecords> getReadRecordsByISBNandUserId(
                @Param("ISBN") String ISBN, @Param("user_id") String user_id);
        

        @Modifying
        @Transactional
        @Query(value = "insert into register_book_records "
                + "(ISBN, user_id, start_date, end_date, read_count, priority, memo) values "
                + "(:ISBN, :user_id, :start_date, :end_date, :read_count, :priority, :memo)", nativeQuery = true)
        void insertReadRecords(
                @Param("ISBN") String ISBN,
                @Param("user_id") String user_id,
                @Param("start_date") String start_date,
                @Param("end_date") String end_date,
                @Param("read_count") int read_count,
                @Param("priority") int priority,
                @Param("memo") String memo);
        }

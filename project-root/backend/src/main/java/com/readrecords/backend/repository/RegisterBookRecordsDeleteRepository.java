package com.readrecords.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.readrecords.backend.entity.RegisterBookRecords;

import jakarta.transaction.Transactional;

@Repository
public interface RegisterBookRecordsDeleteRepository
                extends JpaRepository<RegisterBookRecords, Integer> {
        // record_idを取得するクエリ
        @Query(value = "SELECT record_id FROM register_book_records WHERE ISBN = :isbn AND user_id = :userId", nativeQuery = true)
        Optional<Integer> findRecordIdByIsbnAndUserId(
                        @Param("isbn") String isbn, @Param("userId") String userId);

        @Transactional
        @Modifying
        @Query("DELETE FROM RegisterBookRecords WHERE recordId = :recordId AND userId = :userId")
        void deleteReadRecords(@Param("recordId") Integer recordId,
                        @Param("userId") String userId);
}

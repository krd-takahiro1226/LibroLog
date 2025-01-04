package com.readrecords.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import java.util.Optional;
import java.util.Date;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.readrecords.backend.entity.ReadRecords;

import jakarta.transaction.Transactional;

@Repository
public interface ReadRecordsUpdateRepository extends JpaRepository<ReadRecords, Integer> {
    // record_idを取得するクエリ
    @Query(
        value=
            "SELECT record_id FROM read_records WHERE ISBN = :isbn AND user_id = :userId",
        nativeQuery = true)
    Optional<Integer> findRecordIdByIsbnAndUserId(@Param("isbn") String isbn,
                                                 @Param("userId") String userId);

    @Transactional
    @Modifying
    @Query("UPDATE read_records SET start_date = :startDate, end_date = :endDate, priority = :priority WHERE record_id = :recordId")
    void updateReadRecords(
        @Param("recordId") Integer recordId,
        @Param("startDate") Date startDate,
        @Param("endDate") Date endDate,
        @Param("priority") Integer priority
    );
}


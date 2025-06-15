package com.readrecords.batch.repository;

import com.readrecords.batch.entity.FollowAuthor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@Repository
public interface FollowAuthorRepository extends JpaRepository<FollowAuthor, Integer>  {
    // SELECT * FROM follow_authors WHERE active = true;
    // List<FollowAuthor> findByActiveTrue();
    List<FollowAuthor> findByUserIdAndIsActiveTrue(String userId);
}

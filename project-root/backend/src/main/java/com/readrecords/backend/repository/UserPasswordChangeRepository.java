package com.readrecords.backend.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.readrecords.backend.entity.UserLogin;

@Repository
public interface UserPasswordChangeRepository extends CrudRepository<UserLogin, String> {
    @Modifying
    @Query(
        value = "UPDATE users SET password = :hashPassword WHERE user_id = :userId",
        nativeQuery = true)
    void updatePassword(@Param("userId") String userId, @Param("hashPassword") String password);
  }

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
        value = "UPDATE users SET password = :hashPassword WHERE user_id = :user_id",
        nativeQuery = true)
    void updatePassword(@Param("user_id") String user_id, @Param("hashPassword") String password);
  }

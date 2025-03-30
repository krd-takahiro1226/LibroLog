package com.readrecords.backend.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.readrecords.backend.entity.UserLogin;

@Repository
public interface UsernameChangeRepository extends CrudRepository<UserLogin, String> {
    @Modifying
    @Query(
        value = "UPDATE users SET username = :newUsername WHERE user_id = :userId",
        nativeQuery = true)
    int updateUsername(@Param("userId") String userId, @Param("newUsername") String newUsername);
}
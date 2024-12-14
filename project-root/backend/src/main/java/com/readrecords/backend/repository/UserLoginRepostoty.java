package com.readrecords.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.readrecords.backend.entity.UserLogin;

@Repository
public interface UserLoginRepostoty extends JpaRepository<UserLogin, String> {
    @Query(value = "select * from users " + "where username = :username", nativeQuery = true)
    Optional<UserLogin> findByUsername(@Param("username") String username);

    @Query(value = "select username, password, role from users " + "where username = :username", nativeQuery = true)
    String findPasswordByUsername(@Param("username") String username);
}

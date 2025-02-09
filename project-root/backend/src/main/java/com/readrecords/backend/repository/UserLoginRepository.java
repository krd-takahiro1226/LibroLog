package com.readrecords.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.readrecords.backend.entity.UserLogin;

@Repository
public interface UserLoginRepository extends JpaRepository<UserLogin, String> {
  // username でユーザーを検索
  @Query(value = "select * from users "
      + "where username = :username", nativeQuery = true)
  Optional<UserLogin> findByUsername(@Param("username") String username);

  // user_id でユーザーを検索
  @Query(value = "SELECT * FROM users WHERE user_id = :userId", nativeQuery = true)
  Optional<UserLogin> findByUserId(@Param("userId") String userId);

  // username でパスワードとロールを検索
  @Query(value = "select username, password, role from users "
      + "where username = :username", nativeQuery = true)
  String findPasswordByUsername(@Param("username") String username);
}

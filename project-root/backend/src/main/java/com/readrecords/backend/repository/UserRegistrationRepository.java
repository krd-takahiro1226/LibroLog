package com.readrecords.backend.repository;

import com.readrecords.backend.entity.UserLogin;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRegistrationRepository
        extends CrudRepository<UserLogin, String> {
    @Modifying
    @Query(value = "insert into users "
            + "(user_id, username, email, password) values "
            + "(:user_id, :username, :email, :hashPassword)", nativeQuery = true)
    void insertUserRecords(
            @Param("user_id") String user_id,
            @Param("username") String username,
            @Param("email") String email,
            @Param("hashPassword") String password);
}

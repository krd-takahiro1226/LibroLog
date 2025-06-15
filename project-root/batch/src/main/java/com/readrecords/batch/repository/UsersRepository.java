package com.readrecords.batch.repository;

import com.readrecords.batch.entity.Users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<Users, String> {
    // findAll() は JpaRepository に含まれるので不要
}

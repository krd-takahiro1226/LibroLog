package com.readrecords.batch.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class Users implements Serializable {
  private static final long serialVersionUID = 1L;
  @Id
  @Column(length = 36)
  private String userId;

  @Column(nullable = false, length = 50, unique = true)
  private String username;

  @Column(nullable = false, length = 100, unique = true)
  private String email;

  @Column(nullable = false, length = 255)
  private String password;

  @Column(nullable = false, length = 20)
  private String role = "general";

  @CreationTimestamp
  @Column(updatable = false)
  private Timestamp createdAt;

  @UpdateTimestamp
  private Timestamp updatedAt;
}

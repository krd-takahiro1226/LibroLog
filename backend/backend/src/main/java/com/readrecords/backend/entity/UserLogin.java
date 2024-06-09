package com.readrecords.backend.entity;

import java.io.Serializable;
import java.sql.Timestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
@Data
@Entity
@Table(name = "users")
public class UserLogin implements Serializable {
  private static final long serialVersionUID = 1L;
  @Id
  private Integer user_id;
  private String username;
  private String email;
  private String password;
  private String role;
  private Timestamp created_at;
  private Timestamp updated_at;
}

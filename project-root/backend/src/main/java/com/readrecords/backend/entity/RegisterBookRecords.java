package com.readrecords.backend.entity;

import java.sql.Date;

import com.readrecords.backend.dto.UserReadRecordsDto;

import jakarta.persistence.Column;
import jakarta.persistence.ColumnResult;
import jakarta.persistence.ConstructorResult;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedNativeQuery;
import jakarta.persistence.SqlResultSetMapping;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "register_book_records")
@SqlResultSetMapping(
    name = "UserReadRecordsDtoMapping",
    classes =
        @ConstructorResult(
            targetClass = UserReadRecordsDto.class,
            columns = {
              @ColumnResult(name = "ISBN", type = String.class),
              @ColumnResult(name = "book_name", type = String.class),
              @ColumnResult(name = "author", type = String.class),
              @ColumnResult(name = "start_date", type = Date.class),
              @ColumnResult(name = "end_date", type = Date.class),
              @ColumnResult(name = "read_count", type = Integer.class),
              @ColumnResult(name = "priority", type = Integer.class),
              @ColumnResult(name = "memo", type = String.class)
            }))
@NamedNativeQuery(
    name = "UserReadRecordsDto.getReadRecordsByUserId",
    query =
        "select br.ISBN, br.book_name, br.author, rr.start_date, rr.end_date, rr.read_count, rr.priority, rr.memo "
            + "from book_records br "
            + "inner join register_book_records rr on br.ISBN = rr.ISBN "
            + "where rr.user_id = :user_id",
    resultSetMapping = "UserReadRecordsDtoMapping")
public class RegisterBookRecords {
  @Column(name = "record_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id private Integer recordId;
  @Column(name = "ISBN")
  private String ISBN;
  @Column(name = "user_id")
  private String userId;
  @Column(name = "start_date")
  private Date startDate;
  @Column(name = "end_date")
  private Date endDate;
  @Column(name = "read_count")
  private Integer readCount;
  @Column(name = "priority")
  private Integer priority;
  @Column(name = "memo")
  private String memo;
}

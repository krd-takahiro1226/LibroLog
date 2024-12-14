package com.readrecords.backend.entity;

import java.sql.Date;

import com.readrecords.backend.dto.UserReadRecordsDto;

import jakarta.persistence.ColumnResult;
import jakarta.persistence.ConstructorResult;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedNativeQuery;
import jakarta.persistence.SqlResultSetMapping;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "read_records")

@SqlResultSetMapping(name = "UserReadRecordsDtoMapping", classes = @ConstructorResult(targetClass = UserReadRecordsDto.class, columns = {
        @ColumnResult(name = "ISBN", type = String.class), @ColumnResult(name = "book_name", type = String.class),
        @ColumnResult(name = "author", type = String.class), @ColumnResult(name = "start_date", type = Date.class),
        @ColumnResult(name = "end_date", type = Date.class), @ColumnResult(name = "read_count", type = Integer.class),
        @ColumnResult(name = "priority", type = Integer.class), @ColumnResult(name = "memo", type = String.class) }))
@NamedNativeQuery(name = "UserReadRecordsDto.getReadRecordsByUserId", query = "select br.ISBN, br.book_name, br.author, rr.start_date, rr.end_date, rr.read_count, rr.priority, rr.memo "
        + "from book_records br " + "inner join read_records rr on br.ISBN = rr.ISBN "
        + "where rr.user_id = :user_id", resultSetMapping = "UserReadRecordsDtoMapping")

public class ReadRecords {
    @Id
    private Integer record_id;
    private String ISBN;
    private String user_id;
    private Date start_date;
    private Date end_date;
    private Integer read_count;
    private Integer priority;
    private String memo;
}

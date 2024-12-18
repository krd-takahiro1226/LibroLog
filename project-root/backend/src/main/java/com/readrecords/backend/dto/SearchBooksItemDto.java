package com.readrecords.backend.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import lombok.Data;

@XmlAccessorType(XmlAccessType.FIELD)
@Data
public class SearchBooksItemDto {
  @XmlElement(name = "author")
  private String author;

  @XmlElement(name = "authorKana")
  private String authorKana;

  @XmlElement(name = "isbn")
  private String isbn;

  @XmlElement(name = "publisherName")
  private String publisherName;

  @XmlElement(name = "salesDate")
  private String salesDate;

  @XmlElement(name = "size")
  private String size;

  @XmlElement(name = "smallImageUrl")
  private String smallImageUrl;

  @XmlElement(name = "subTitle")
  private String subTitle;

  @XmlElement(name = "subTitleKana")
  private String subTitleKana;

  @XmlElement(name = "title")
  private String title;

  @XmlElement(name = "titleKana")
  private String titleKana;
}

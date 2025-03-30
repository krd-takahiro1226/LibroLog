package com.readrecords.backend.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import lombok.Data;

/** 書籍検索結果のレスポンス(個別情報) */
@XmlAccessorType(XmlAccessType.FIELD)
@Data
public class SearchBooksItemDto {
  /** 著者名 */
  @XmlElement(name = "author")
  private String author;

  /** 著者名(カナ) */
  @XmlElement(name = "authorKana")
  private String authorKana;

  /** ISBN */
  @XmlElement(name = "isbn")
  private String isbn;

  /** 出版社名 */
  @XmlElement(name = "publisherName")
  private String publisherName;

  /** 出版日 */
  @XmlElement(name = "salesDate")
  private String salesDate;

  /** 書籍サイズ(ジャンル) */
  @XmlElement(name = "size")
  private String size;

  /** 書影画像 */
  @XmlElement(name = "smallImageUrl")
  private String smallImageUrl;

  /** 書籍サブタイトル */
  @XmlElement(name = "subTitle")
  private String subTitle;

  /** 書籍サブタイトル(カナ) */
  @XmlElement(name = "subTitleKana")
  private String subTitleKana;

  /** 書籍タイトル */
  @XmlElement(name = "title")
  private String title;

  /** 書籍タイトル(カナ) */
  @XmlElement(name = "titleKana")
  private String titleKana;
}

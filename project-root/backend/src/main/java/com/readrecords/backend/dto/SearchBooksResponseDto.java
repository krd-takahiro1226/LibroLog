package com.readrecords.backend.dto;

import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Data;

/** 書籍検索結果のレスポンス(全体情報) */
@XmlRootElement(name = "root")
@XmlAccessorType(XmlAccessType.FIELD)
@Data
public class SearchBooksResponseDto {
  @XmlElementWrapper(name = "Items")
  @XmlElement(name = "Item")
  private List<SearchBooksItemDto> items;

  /** キャリア情報(PCもしくはモバイル) */
  @XmlElement(name = "carrier")
  private int carrier;

  /** 検索結果総数 */
  @XmlElement(name = "count")
  private int count;

  /** ページ内始追番 */
  @XmlElement(name = "first")
  private int first;

  /** 検索結果ヒット数 */
  @XmlElement(name = "hits")
  private int hits;

  /** ページ内終追番 */
  @XmlElement(name = "last")
  private int last;

  /** ページ番号 */
  @XmlElement(name = "page")
  private int page;

  /** 総ページ数 */
  @XmlElement(name = "pageCount")
  private int pageCount;
}

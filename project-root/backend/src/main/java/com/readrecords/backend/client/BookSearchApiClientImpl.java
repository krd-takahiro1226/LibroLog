package com.readrecords.backend.client;

import com.readrecords.backend.dto.SearchBooksResponseDto;
import com.readrecords.backend.service.XmlParser;
import java.io.BufferedReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class BookSearchApiClientImpl implements BookSearchApiClient {
  @Autowired
  XmlParser xmlParser;

  private static final String TITLEHEADER = "&title=";

  private static final String AUTHORHEADER = "&author=";

  private static final String PUBLISHERNAMEHEADER = "&publisherName=";

  private static final String ISBNHEADER = "&isbn=";

  private static final String CURRENTPAGEHEADER = "&page=";

  private static final String LIMITHEADER = "&hits=";


  @Value("${key.api}")
  private String applicationId;

  @Override
  public SearchBooksResponseDto getBookSearch(
      String title, String author, String publisherName, String isbn,
      Integer currentPage, Integer limit)
      throws Exception {
    // ベースとなるリクエストURLの作成
    String requestPath = "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?";
    String format = "xml";
    requestPath += "applicationId=" + applicationId;
    requestPath += "&format=" + format;
    URL requestURL = null;
    // リクエストパラメータを追加したURLの作成
    try {
      // UTF-8エンコード処理
      String titleEncoding = URLEncoder.encode(title != null ? title : "",
          "UTF-8");
      String authorEncoding = URLEncoder.encode(author != null ? author : "",
          "UTF-8");
      String publisherNameEncoding = URLEncoder
          .encode(publisherName != null ? publisherName : "", "UTF-8");
      String isbnEncoding = URLEncoder.encode(isbn != null ? isbn : "",
          "UTF-8");

      String titlequery = TITLEHEADER + titleEncoding;
      String authorquery = AUTHORHEADER + authorEncoding;
      String publisherquery = PUBLISHERNAMEHEADER + publisherNameEncoding;
      String isbnquery = ISBNHEADER + isbnEncoding;
      String currentPagequery = CURRENTPAGEHEADER + currentPage;
      String limitquery = LIMITHEADER + limit;
      String query = "";
      if (title != null && !title.isEmpty()) {
        query += titlequery;
      }
      if (author != null && !author.isEmpty()) {
        query += authorquery;
      }
      if (publisherName != null && !publisherName.isEmpty()) {
        query += publisherquery;
      }
      if (isbn != null && !isbn.isEmpty()) {
        query += isbnquery;
      }
      if (currentPage >= 1){
        query += currentPagequery;
      }
      if (limit >= 1){
        query += limitquery;
      }
      if (query == null || query.isEmpty()) {
        throw new Exception("検索条件を入力してください");
      }
      String url = new String(requestPath + query);
      requestURL = URI.create(url.toString()).toURL();
      // エラーハンドリング
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    } catch (MalformedURLException e) {
      e.printStackTrace();
    }
    // コネクションのインスタンス
    HttpURLConnection conn = (HttpURLConnection) requestURL.openConnection();
    // リクエストメソッドとしてGETメソッドを指定
    conn.setRequestMethod("GET");
    conn.setRequestProperty("Accept", "application/xml");
    // 正常終了以外エラーとする
    if (conn.getResponseCode() != 200) {
      throw new RuntimeException(
          "Failed : HTTP error code : " + conn.getResponseCode());
    }
    // InputStreamReaderを使用するとUTF-16で取得してしまうため、もしかしたら修正する必要あり
    BufferedReader br = new BufferedReader(
        new java.io.InputStreamReader((conn.getInputStream())));
    // StringBuilder=文字列連結が効率よく行えるStringのイメージ
    StringBuilder response = new StringBuilder();
    String output;
    // BufferedReaderの内容を1行ずつ読み込んでStringBuilderに追加
    while ((output = br.readLine()) != null) {
      response.append(output);
    }
    conn.disconnect();
    return xmlParser.parse(response.toString());
  }
}

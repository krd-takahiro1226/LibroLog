package com.readrecords.backend.client;

import java.io.BufferedReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readrecords.backend.dto.SearchBooksResponseDto;
import com.readrecords.backend.service.XmlParser;

@Service
public class BookSearchApiClientImpl implements BookSearchApiClient {
  @Autowired XmlParser xmlParser;
  @Override
  public SearchBooksResponseDto getBookSearch(String title, String author, String publisherName, String isbn) throws Exception {
    // ベースとなるリクエストURLの作成
    String requestPath = "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?";
    String applicationId = "1002321977022357484";
    String format = "xml";
    requestPath += "applicationId=" + applicationId;
    requestPath += "&format=" + format;
    URL requestURL = null;
    // リクエストパラメータを追加したURLの作成
    try {
    // UTF-8エンコード処理
    String titleEncoding = URLEncoder.encode(title, "UTF-8");
    String authorEncoding = URLEncoder.encode(author, "UTF-8");
    String publisherNameEncoding = URLEncoder.encode(publisherName, "UTF-8");
    String isbnEncoding = URLEncoder.encode(isbn, "UTF-8");
    String titlequery = "&title=" + titleEncoding;
    String authorquery = "&author=" + authorEncoding;
    String publisherquery = "&publisherName=" + publisherNameEncoding;
    String isbnquery = "&isbn=" + isbnEncoding;
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
    if (conn.getResponseCode() != 200){
    throw new RuntimeException("Failed : HTTP error code : "
        + conn.getResponseCode());
    }
    // InputStreamReaderを使用するとUTF-16で取得してしまうため、もしかしたら修正する必要あり
    BufferedReader br = new BufferedReader(new java.io.InputStreamReader((conn.getInputStream())));
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

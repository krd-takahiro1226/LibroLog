package com.readrecords.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.readrecords.backend.service.FavoriteAuthorsService;

@RestController
public class FavoriteAuthorsController {

  @Autowired
  FavoriteAuthorsService favoriteAuthorsService;

  /**
   * お気に入り著者一覧を取得
   *
   * @param authentication
   * @return お気に入り著者一覧
   */
  @GetMapping("/favoriteAuthors")
  public ResponseEntity<?> getFavoriteAuthors(Authentication authentication) {
    System.out.println("★★★ getFavoriteAuthors called");
    System.out.println("★★★ Authentication: " + authentication);
    Map<String, Object> result = favoriteAuthorsService.getFavoriteAuthors(authentication);
    
    if ("success".equals(result.get("status"))) {
      return ResponseEntity.ok(result);
    } else {
      return ResponseEntity.badRequest().body(result);
    }
  }

  /**
   * 著者をフォロー
   *
   * @param authorName
   * @param authentication
   * @return 処理結果
   */
  @PostMapping("/favoriteAuthors/follow")
  public ResponseEntity<?> followAuthor(
      @RequestParam("authorName") String authorName,
      Authentication authentication) {
    
    Map<String, Object> result = favoriteAuthorsService.followAuthor(authentication, authorName);
    
    if ("success".equals(result.get("status"))) {
      return ResponseEntity.ok(result);
    } else {
      return ResponseEntity.badRequest().body(result);
    }
  }

  /**
   * 著者のフォローを解除
   *
   * @param authorName
   * @param authentication
   * @return 処理結果
   */
  @PostMapping("/favoriteAuthors/unfollow")
  public ResponseEntity<?> unfollowAuthor(
      @RequestParam("authorName") String authorName,
      Authentication authentication) {
    
    Map<String, Object> result = favoriteAuthorsService.unfollowAuthor(authentication, authorName);
    
    if ("success".equals(result.get("status"))) {
      return ResponseEntity.ok(result);
    } else {
      return ResponseEntity.badRequest().body(result);
    }
  }

  /**
   * 著者のフォロー状態を確認
   *
   * @param authorName
   * @param authentication
   * @return フォロー状態
   */
  @GetMapping("/favoriteAuthors/status")
  public ResponseEntity<?> checkFollowStatus(
      @RequestParam("authorName") String authorName,
      Authentication authentication) {
    
    Map<String, Object> result = favoriteAuthorsService.checkFollowStatus(authentication, authorName);
    
    if ("success".equals(result.get("status"))) {
      return ResponseEntity.ok(result);
    } else {
      return ResponseEntity.badRequest().body(result);
    }
  }

  /**
   * 著者を再フォロー
   *
   * @param authorName
   * @param authentication
   * @return 処理結果
   */
  @PostMapping("/favoriteAuthors/refollow")
  public ResponseEntity<?> refollowAuthor(
      @RequestParam("authorName") String authorName,
      Authentication authentication) {
    
    Map<String, Object> result = favoriteAuthorsService.refollowAuthor(authentication, authorName);
    
    if ("success".equals(result.get("status"))) {
      return ResponseEntity.ok(result);
    } else {
      return ResponseEntity.badRequest().body(result);
    }
  }

  /**
   * 著者を完全削除
   *
   * @param authorName
   * @param authentication
   * @return 処理結果
   */
  @PostMapping("/favoriteAuthors/delete")
  public ResponseEntity<?> deleteAuthor(
      @RequestParam("authorName") String authorName,
      Authentication authentication) {
    
    Map<String, Object> result = favoriteAuthorsService.deleteAuthor(authentication, authorName);
    
    if ("success".equals(result.get("status"))) {
      return ResponseEntity.ok(result);
    } else {
      return ResponseEntity.badRequest().body(result);
    }
  }
}
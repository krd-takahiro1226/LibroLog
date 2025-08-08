package com.readrecords.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.readrecords.backend.dto.FavoriteAuthorsDto;
import com.readrecords.backend.entity.FavoriteAuthors;
import com.readrecords.backend.repository.FavoriteAuthorsRepository;
import com.readrecords.backend.security.UserLoginDetails;

@Service
public class FavoriteAuthorsService {
  private static final Logger logger = LoggerFactory
      .getLogger(FavoriteAuthorsService.class);

  private static final String FAVORITE_AUTHORS = "favoriteAuthors";
  private static final String STATUS = "status";
  private static final String MESSAGE = "message";
  private static final String SUCCESS = "success";
  private static final String ERROR = "error";

  @Autowired
  FavoriteAuthorsRepository favoriteAuthorsRepository;

  /**
   * ユーザーのお気に入り著者一覧を取得（アクティブ・非アクティブ両方）
   *
   * @param authentication
   * @return お気に入り著者一覧
   */
  public Map<String, Object> getFavoriteAuthors(Authentication authentication) {
    String userId = getUserId(authentication);
    logger.info("Fetching all favorite authors for userId: {}", userId);

    Map<String, Object> result = new HashMap<>();
    
    try {
      List<FavoriteAuthors> favoriteAuthorsList = favoriteAuthorsRepository
          .findAllByUserId(userId);
      
      List<FavoriteAuthorsDto> favoriteAuthorsDtos = convertToDto(favoriteAuthorsList);
      
      result.put(FAVORITE_AUTHORS, favoriteAuthorsDtos);
      result.put(STATUS, SUCCESS);
      
    } catch (Exception e) {
      logger.error("Error fetching favorite authors for userId: {}", userId, e);
      result.put(STATUS, ERROR);
      result.put(MESSAGE, "お気に入り著者の取得に失敗しました");
    }
    
    return result;
  }

  /**
   * 著者をお気に入りに追加（フォロー）
   *
   * @param authentication
   * @param authorName
   * @return 処理結果
   */
  public Map<String, Object> followAuthor(Authentication authentication, String authorName) {
    String userId = getUserId(authentication);
    logger.info("Following author: {} for userId: {}", authorName, userId);

    Map<String, Object> result = new HashMap<>();
    
    try {
      // まずシンプルに新規レコード作成のみを試す
      FavoriteAuthors newFavorite = createNewFavoriteAuthor(userId, authorName);
      logger.info("Created favorite author object: {}", newFavorite);
      
      FavoriteAuthors saved = favoriteAuthorsRepository.save(newFavorite);
      logger.info("Saved favorite author: {}", saved);
      
      result.put(STATUS, SUCCESS);
      result.put(MESSAGE, "著者をフォローしました");
      
    } catch (Exception e) {
      logger.error("Error following author: {} for userId: {}", authorName, userId, e);
      e.printStackTrace();
      result.put(STATUS, ERROR);
      result.put(MESSAGE, "フォローに失敗しました: " + e.getMessage());
    }
    
    return result;
  }

  /**
   * 著者のフォローを解除（アンフォロー）
   *
   * @param authentication
   * @param authorName
   * @return 処理結果
   */
  public Map<String, Object> unfollowAuthor(Authentication authentication, String authorName) {
    String userId = getUserId(authentication);
    logger.info("Unfollowing author: {} for userId: {}", authorName, userId);

    Map<String, Object> result = new HashMap<>();
    
    try {
      int updateCount = favoriteAuthorsRepository.deactivateFavoriteAuthor(userId, authorName);
      
      if (updateCount > 0) {
        result.put(STATUS, SUCCESS);
        result.put(MESSAGE, "フォローを解除しました");
      } else {
        result.put(STATUS, ERROR);
        result.put(MESSAGE, "フォロー解除に失敗しました");
      }
      
    } catch (Exception e) {
      logger.error("Error unfollowing author: {} for userId: {}", authorName, userId, e);
      result.put(STATUS, ERROR);
      result.put(MESSAGE, "フォロー解除に失敗しました");
    }
    
    return result;
  }

  /**
   * 著者を再フォロー（再アクティブ化）
   *
   * @param authentication
   * @param authorName
   * @return 処理結果
   */
  public Map<String, Object> refollowAuthor(Authentication authentication, String authorName) {
    String userId = getUserId(authentication);
    logger.info("Refollowing author: {} for userId: {}", authorName, userId);

    Map<String, Object> result = new HashMap<>();
    
    try {
      int updateCount = favoriteAuthorsRepository.activateFavoriteAuthor(userId, authorName);
      
      if (updateCount > 0) {
        result.put(STATUS, SUCCESS);
        result.put(MESSAGE, "再フォローしました");
      } else {
        result.put(STATUS, ERROR);
        result.put(MESSAGE, "再フォローに失敗しました");
      }
      
    } catch (Exception e) {
      logger.error("Error refollowing author: {} for userId: {}", authorName, userId, e);
      result.put(STATUS, ERROR);
      result.put(MESSAGE, "再フォローに失敗しました");
    }
    
    return result;
  }

  /**
   * 著者を完全削除
   *
   * @param authentication
   * @param authorName
   * @return 処理結果
   */
  public Map<String, Object> deleteAuthor(Authentication authentication, String authorName) {
    String userId = getUserId(authentication);
    logger.info("Deleting author: {} for userId: {}", authorName, userId);

    Map<String, Object> result = new HashMap<>();
    
    try {
      int deleteCount = favoriteAuthorsRepository.deleteFavoriteAuthor(userId, authorName);
      
      if (deleteCount > 0) {
        result.put(STATUS, SUCCESS);
        result.put(MESSAGE, "著者を削除しました");
      } else {
        result.put(STATUS, ERROR);
        result.put(MESSAGE, "著者の削除に失敗しました");
      }
      
    } catch (Exception e) {
      logger.error("Error deleting author: {} for userId: {}", authorName, userId, e);
      result.put(STATUS, ERROR);
      result.put(MESSAGE, "著者の削除に失敗しました");
    }
    
    return result;
  }

  /**
   * 著者のフォロー状態を確認
   *
   * @param authentication
   * @param authorName
   * @return フォロー状態
   */
  public Map<String, Object> checkFollowStatus(Authentication authentication, String authorName) {
    String userId = getUserId(authentication);
    logger.info("Checking follow status for author: {} and userId: {}", authorName, userId);

    Map<String, Object> result = new HashMap<>();
    
    try {
      Optional<FavoriteAuthors> favorite = favoriteAuthorsRepository
          .findByUserIdAndAuthorName(userId, authorName);
      
      boolean isFollowing = favorite.isPresent() && favorite.get().getIs_active();
      
      result.put("isFollowing", isFollowing);
      result.put(STATUS, SUCCESS);
      
    } catch (Exception e) {
      logger.error("Error checking follow status for author: {} and userId: {}", 
                   authorName, userId, e);
      result.put(STATUS, ERROR);
      result.put(MESSAGE, "フォロー状態の確認に失敗しました");
    }
    
    return result;
  }

  private String getUserId(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      logger.warn("Unauthorized access attempt");
      throw new IllegalStateException(
          "Authentication is required to fetch userId");
    }

    try {
      logger.info("Authenticated user: {}", authentication.getName());
      System.out.println("Authentication: " + authentication);
      String userId = authentication.getDetails().toString();
      logger.info("Fetching records for userId: {}", userId);
      return userId;

    } catch (Exception e) {
      logger.error("Error fetching records", e);
      throw new IllegalStateException("Failed to fetch userId", e);
    }
  }

  private List<FavoriteAuthorsDto> convertToDto(List<FavoriteAuthors> favoriteAuthorsList) {
    List<FavoriteAuthorsDto> dtoList = new ArrayList<>();
    
    for (FavoriteAuthors favoriteAuthor : favoriteAuthorsList) {
      FavoriteAuthorsDto dto = new FavoriteAuthorsDto();
      dto.setId(favoriteAuthor.getId());
      dto.setAuthorName(favoriteAuthor.getAuthor_name());
      dto.setIsFollowing(favoriteAuthor.getIs_active());
      dtoList.add(dto);
    }
    
    return dtoList;
  }

  private FavoriteAuthors createNewFavoriteAuthor(String userId, String authorName) {
    FavoriteAuthors favoriteAuthor = new FavoriteAuthors();
    favoriteAuthor.setUser_id(userId);
    favoriteAuthor.setAuthor_name(authorName);
    favoriteAuthor.setIs_active(true);
    return favoriteAuthor;
  }
}
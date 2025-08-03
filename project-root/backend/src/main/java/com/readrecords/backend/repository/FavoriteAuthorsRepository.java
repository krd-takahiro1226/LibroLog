package com.readrecords.backend.repository;

import com.readrecords.backend.entity.FavoriteAuthors;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface FavoriteAuthorsRepository extends CrudRepository<FavoriteAuthors, Long> {
    
    /**
     * 指定したユーザーIDのアクティブなお気に入り著者一覧を取得
     *
     * @param userId
     * @return お気に入り著者一覧
     */
    @Query(value = "SELECT * FROM favorite_authors " +
            "WHERE user_id = :user_id AND is_active = true " +
            "ORDER BY created_at DESC", nativeQuery = true)
    List<FavoriteAuthors> findActiveByUserId(@Param("user_id") String userId);
    
    /**
     * 指定したユーザーIDと著者名でお気に入り登録済みかチェック
     *
     * @param userId
     * @param authorName
     * @return お気に入り著者情報
     */
    @Query(value = "SELECT * FROM favorite_authors " +
            "WHERE user_id = :user_id AND author_name = :author_name", nativeQuery = true)
    Optional<FavoriteAuthors> findByUserIdAndAuthorName(
            @Param("user_id") String userId, 
            @Param("author_name") String authorName);
    
    /**
     * 指定したユーザーIDと著者名のお気に入りをアクティブ状態に更新
     *
     * @param userId
     * @param authorName
     * @return 更新件数
     */
    @Modifying
    @Transactional
    @Query(value = "UPDATE favorite_authors SET is_active = true " +
            "WHERE user_id = :user_id AND author_name = :author_name", nativeQuery = true)
    int activateFavoriteAuthor(@Param("user_id") String userId, 
                              @Param("author_name") String authorName);
    
    /**
     * 指定したユーザーIDと著者名のお気に入りを非アクティブ状態に更新
     *
     * @param userId
     * @param authorName
     * @return 更新件数
     */
    @Modifying
    @Transactional
    @Query(value = "UPDATE favorite_authors SET is_active = false " +
            "WHERE user_id = :user_id AND author_name = :author_name", nativeQuery = true)
    int deactivateFavoriteAuthor(@Param("user_id") String userId, 
                                @Param("author_name") String authorName);
}
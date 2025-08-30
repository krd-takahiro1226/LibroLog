package com.readrecords.backend.config;

import com.readrecords.backend.entity.TemporaryUser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis設定クラス
 */
@Configuration
public class RedisConfig {
  /**
   * 一時ユーザー情報用のRedisTemplate
   */
  @Bean
  public RedisTemplate<String, TemporaryUser> temporaryUserRedisTemplate(
      RedisConnectionFactory connectionFactory) {
    RedisTemplate<String, TemporaryUser> template = new RedisTemplate<>();
    template.setConnectionFactory(connectionFactory);

    // キーのシリアライザー（文字列）
    template.setKeySerializer(new StringRedisSerializer());
    template.setHashKeySerializer(new StringRedisSerializer());

    // 値のシリアライザー（JSON）
    template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
    template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

    template.afterPropertiesSet();
    return template;
  }
}

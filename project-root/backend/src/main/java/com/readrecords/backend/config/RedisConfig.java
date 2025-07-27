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
   * TemporaryUser用のRedisTemplateを定義
   */
  @Bean
  public RedisTemplate<String, TemporaryUser> temporaryUserRedisTemplate(
      RedisConnectionFactory connectionFactory) {
    RedisTemplate<String, TemporaryUser> template = new RedisTemplate<>();
    template.setConnectionFactory(connectionFactory);

    // Key用のシリアライザー（文字列）
    template.setKeySerializer(new StringRedisSerializer());
    template.setHashKeySerializer(new StringRedisSerializer());

    // Value用のシリアライザー（JSON）
    template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
    template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

    // デフォルトシリアライザー設定
    template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());

    template.afterPropertiesSet();
    return template;
  }
}

package com.chodae.service;

import com.chodae.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * 한 계정당 단일 세션 제어 (Redis 기반).
 * 새 로그인 시 기존 토큰 무효화, 현재 토큰만 유효.
 * Redis 장애 시 예외를 삼켜 로그인/인증이 완전히 차단되지 않도록 함.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TokenSessionService {

    private static final String KEY_PREFIX = "user_session:";

    private final StringRedisTemplate redisTemplate;
    private final JwtUtil jwtUtil;

    @Value("${jwt.expiration}")
    private long expirationMs;

    /**
     * 로그인 시 호출. 해당 사용자의 기존 세션을 새 토큰으로 교체.
     * TTL은 JWT 만료 시간과 동일하게 설정.
     * Redis 장애 시 로그만 남기고 예외를 던지지 않음 (로그인은 성공 처리).
     */
    public void registerSession(String userId, String tokenId) {
        try {
            String key = KEY_PREFIX + userId;
            long ttlSeconds = TimeUnit.MILLISECONDS.toSeconds(expirationMs);
            redisTemplate.opsForValue().set(key, tokenId, ttlSeconds, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("Redis 세션 등록 실패 (로그인은 진행됨) - userId: {}, error: {}", userId, e.getMessage());
        }
    }

    /**
     * 토큰이 현재 유효한 세션인지 검증.
     * JWT 서명/만료 검증 후, Redis에 저장된 token_id와 일치하는지 확인.
     * Redis 장애 시 false 반환 (인증 실패로 처리).
     */
    public boolean isCurrentSession(String token) {
        if (!jwtUtil.validateToken(token)) {
            return false;
        }
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            String jti = jwtUtil.getJtiFromToken(token);
            if (jti == null) return false;

            String key = KEY_PREFIX + userId;
            String storedTokenId = redisTemplate.opsForValue().get(key);
            return jti.equals(storedTokenId);
        } catch (Exception e) {
            log.warn("Redis 세션 검증 실패 - token 검증 불가: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 로그아웃 시 호출. 해당 사용자 세션 삭제 → 기존 토큰 무효화.
     */
    public void invalidateSession(String userId) {
        try {
            redisTemplate.delete(KEY_PREFIX + userId);
        } catch (Exception e) {
            log.warn("Redis 세션 삭제 실패 - userId: {}, error: {}", userId, e.getMessage());
        }
    }
}

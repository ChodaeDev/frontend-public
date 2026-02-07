package com.chodae.mapper;

import com.chodae.dto.UserResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface UserMapper {

    /**
     * 사용자 ID로 사용자 조회 (비밀번호 포함, 로그인용)
     */
    Map<String, Object> findByUserIdWithPassword(String userId);

    /**
     * 사용자 ID로 사용자 조회 (비밀번호 제외)
     */
    UserResponse findByUserId(String userId);

    /**
     * 사용자 ID로 사용자 존재 여부 확인
     */
    boolean existsByUserId(String userId);

    /**
     * 사용자 등록
     */
    int insertUser(Map<String, Object> userMap);

    /**
     * 사용자 정보 수정
     */
    int updateUser(Map<String, Object> userMap);

    /**
     * 사용자 삭제
     */
    int deleteUser(Integer id);

    /**
     * ID로 사용자 조회
     */
    UserResponse findById(Integer id);
}

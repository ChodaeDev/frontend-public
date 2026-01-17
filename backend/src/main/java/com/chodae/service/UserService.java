package com.chodae.service;

import com.chodae.dto.UserLoginRequest;
import com.chodae.dto.UserRegisterRequest;
import com.chodae.dto.UserResponse;
import com.chodae.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse registerUser(UserRegisterRequest request) {
        log.debug("registerUser 시작 - userId: {}", request.getUserId());
        validateRegisterRequest(request);

        // 사용자 ID 중복 확인
        log.debug("사용자 ID 중복 확인 중 - userId: {}", request.getUserId());
        boolean exists = userMapper.existsByUserId(request.getUserId());
        log.debug("사용자 ID 중복 확인 결과 - userId: {}, exists: {}", request.getUserId(), exists);

        if (exists) {
            log.warn("이미 존재하는 사용자 ID - userId: {}", request.getUserId());
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다.");
        }

        // Map으로 사용자 정보 구성
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("userId", request.getUserId());
        userMap.put("username", request.getUsername());
        userMap.put("password", passwordEncoder.encode(request.getPassword()));
        userMap.put("nickname", request.getNickname());
        userMap.put("phone", request.getPhone());
        userMap.put("church", request.getChurch());
        userMap.put("birthday", parseDateOrNull(request.getBirthday()));
        userMap.put("descr", request.getDescr());

        log.debug("사용자 등록 시도 - userId: {}", request.getUserId());
        // MyBatis를 통한 사용자 등록
        int result = userMapper.insertUser(userMap);
        log.debug("사용자 등록 결과 - userId: {}, result: {}", request.getUserId(), result);

        if (result == 0) {
            log.error("회원가입 실패 - userId: {}", request.getUserId());
            throw new IllegalArgumentException("회원가입에 실패했습니다.");
        }

        // 등록된 사용자 조회
        log.debug("등록된 사용자 조회 중 - userId: {}", request.getUserId());
        UserResponse saved = userMapper.findByUserId(request.getUserId());
        log.debug("등록된 사용자 조회 결과 - userId: {}, saved: {}", request.getUserId(), saved != null);

        if (saved == null) {
            log.error("회원가입 후 사용자 조회 실패 - userId: {}", request.getUserId());
            throw new IllegalArgumentException("회원가입 후 사용자 조회에 실패했습니다.");
        }

        log.info("회원가입 완료 - userId: {}, id: {}", request.getUserId(), saved.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public UserResponse login(UserLoginRequest request) {
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("비밀번호를 입력해주세요.");
        }

        Map<String, Object> userMap = userMapper.findByUserIdWithPassword(request.getUserId());
        if (userMap == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }

        String storedPassword = (String) userMap.get("password");
        if (!passwordEncoder.matches(request.getPassword(), storedPassword)) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // Map을 UserResponse로 변환
        return UserResponse.builder()
                .id((Integer) userMap.get("id"))
                .userId((String) userMap.get("userId"))
                .username((String) userMap.get("username"))
                .nickname((String) userMap.get("nickname"))
                .phone((String) userMap.get("phone"))
                .church((String) userMap.get("church"))
                .birthday((LocalDate) userMap.get("birthday"))
                .descr((String) userMap.get("descr"))
                .build();
    }

    private void validateRegisterRequest(UserRegisterRequest request) {
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new IllegalArgumentException("아이디를 입력해주세요.");
        }
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new IllegalArgumentException("이름을 입력해주세요.");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("비밀번호를 입력해주세요.");
        }
    }

    private LocalDate parseDateOrNull(String date) {
        if (date == null || date.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(date);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("생년월일 형식이 올바르지 않습니다. (yyyy-MM-dd)");
        }
    }

}

package com.chodae.service;

import com.chodae.dto.LoginResponse;
import com.chodae.dto.UserLevel;
import com.chodae.dto.UserLoginRequest;
import com.chodae.dto.UserRegisterRequest;
import com.chodae.dto.UserResponse;
import com.chodae.mapper.UserMapper;
import com.chodae.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Date;
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
    private final JwtUtil jwtUtil;
    private final TokenSessionService tokenSessionService;

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
        userMap.put("userName", request.getUserName());
        userMap.put("password", passwordEncoder.encode(request.getPassword()));
        userMap.put("nickName", request.getNickName());
        userMap.put("phone", request.getPhone());
        userMap.put("church", request.getChurch());
        userMap.put("birthday", parseDateOrNull(request.getBirthday()));
        userMap.put("description", request.getDescription());
        userMap.put("level", UserLevel.GENERAL.toValue()); // 회원가입 시 기본 등급: 일반사용자

        log.debug("사용자 등록 시도 - userId: {}", request.getUserId());
        // MyBatis를 통한 사용자 등록
        int result = userMapper.insertUser(userMap);
        log.debug("사용자 등록 결과 - userId: {}, result: {}", request.getUserId(), result);

        if (result == 0) {
            log.error("회원가입 실패 - userId: {}", request.getUserId());
            throw new IllegalArgumentException("회원가입에 실패했습니다.");
        }

        // INSERT 후 생성된 id와 요청 데이터로 UserResponse 구성 (findByUserId 호출 제거 - level DB값 대소문자 이슈 회피)
        Object idObj = userMap.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            log.error("회원가입 후 ID 조회 실패 - userId: {}", request.getUserId());
            throw new IllegalArgumentException("회원가입 후 사용자 조회에 실패했습니다.");
        }

        log.info("회원가입 완료 - userId: {}, id: {}", request.getUserId(), id);
        return UserResponse.builder()
                .id(id)
                .userId(request.getUserId())
                .userName(request.getUserName())
                .nickName(request.getNickName())
                .phone(request.getPhone())
                .church(request.getChurch())
                .birthday(parseDateOrNull(request.getBirthday()))
                .description(request.getDescription())
                .level(UserLevel.GENERAL)
                .build();
    }

    @Transactional(readOnly = true)
    public LoginResponse login(UserLoginRequest request) {
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

        // Map을 UserResponse로 변환 (MyBatis는 DATE 컬럼을 java.sql.Date로 반환함)
        Object birthdayObj = userMap.get("birthday");
        LocalDate birthday = null;
        if (birthdayObj instanceof Date) {
            birthday = ((Date) birthdayObj).toLocalDate();
        } else if (birthdayObj instanceof LocalDate) {
            birthday = (LocalDate) birthdayObj;
        }

        Object levelObj = userMap.get("level");
        UserLevel level = UserLevel.fromString(levelObj != null ? levelObj.toString() : null);
        Object idObj = userMap.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalArgumentException("사용자 ID 정보를 읽을 수 없습니다.");
        }

        UserResponse user = UserResponse.builder()
                .id(id)
                .userId((String) userMap.get("userId"))
                .userName((String) userMap.get("userName"))
                .nickName((String) userMap.get("nickName"))
                .phone((String) userMap.get("phone"))
                .church((String) userMap.get("church"))
                .birthday(birthday)
                .description((String) userMap.get("description"))
                .level(level)
                .build();
        JwtUtil.TokenWithJti tokenWithJti = jwtUtil.generateToken(user.getUserId());
        tokenSessionService.registerSession(user.getUserId(), tokenWithJti.jti());
        return LoginResponse.builder().user(user).token(tokenWithJti.token()).build();
    }

    private void validateRegisterRequest(UserRegisterRequest request) {
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new IllegalArgumentException("아이디를 입력해주세요.");
        }
        if (request.getUserName() == null || request.getUserName().isBlank()) {
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

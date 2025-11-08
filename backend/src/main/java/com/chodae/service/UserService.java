package com.chodae.service;

import com.chodae.dto.UserLoginRequest;
import com.chodae.dto.UserRegisterRequest;
import com.chodae.dto.UserResponse;
import com.chodae.entity.User;
import com.chodae.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse registerUser(UserRegisterRequest request) {
        validateRegisterRequest(request);

        userRepository.findByUserId(request.getUserId()).ifPresent(existing -> {
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다.");
        });

        User user = User.builder()
                .userId(request.getUserId())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .phone(request.getPhone())
                .church(request.getChurch())
                .birthday(parseDateOrNull(request.getBirthday()))
                .desc(request.getDesc())
                .build();

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public UserResponse login(UserLoginRequest request) {
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("비밀번호를 입력해주세요.");
        }

        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return toResponse(user);
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

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .church(user.getChurch())
                .birthday(user.getBirthday())
                .desc(user.getDesc())
                .build();
    }
}


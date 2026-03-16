package com.chodae.controller;

import com.chodae.dto.ApiResponse;
import com.chodae.dto.LoginResponse;
import com.chodae.dto.UserLoginRequest;
import com.chodae.dto.UserRegisterRequest;
import com.chodae.dto.UserResponse;
import com.chodae.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "사용자 정보", description = "사용자 정보 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/public/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody UserRegisterRequest request) {
        log.info("회원가입 요청 수신 - userId: {}", request.getUserId());
        try {
            UserResponse response = userService.registerUser(request);
            log.info("회원가입 성공 - userId: {}, id: {}", request.getUserId(), response.getId());
            return ApiResponse.success("회원가입이 완료되었습니다.", response);
        } catch (Exception e) {
            log.error("회원가입 실패 - userId: {}, error: {}", request.getUserId(), e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody UserLoginRequest request) {
        log.info("로그인 요청 수신 - userId: {}", request.getUserId());
        try {
            LoginResponse response = userService.login(request);
            log.info("로그인 성공 - userId: {}", request.getUserId());
            return ApiResponse.success("로그인에 성공했습니다.", response);
        } catch (Exception e) {
            log.error("로그인 실패 - userId: {}, error: {}", request.getUserId(), e.getMessage(), e);
            throw e;
        }
    }
}

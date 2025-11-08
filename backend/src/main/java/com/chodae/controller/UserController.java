package com.chodae.controller;

import com.chodae.dto.ApiResponse;
import com.chodae.dto.UserLoginRequest;
import com.chodae.dto.UserRegisterRequest;
import com.chodae.dto.UserResponse;
import com.chodae.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody UserRegisterRequest request) {
        UserResponse response = userService.registerUser(request);
        return ApiResponse.success("회원가입이 완료되었습니다.", response);
    }

    @PostMapping("/login")
    public ApiResponse<UserResponse> login(@RequestBody UserLoginRequest request) {
        UserResponse response = userService.login(request);
        return ApiResponse.success("로그인에 성공했습니다.", response);
    }
}


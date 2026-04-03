package com.chodae.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
public class UserLoginRequest {
    @Schema(description = "사용자 아이디", example = "admin")
    private String userId;
    @Schema(description = "사용자 비밀번호", example = "dhwlrdmsgP")
    private String password;
}


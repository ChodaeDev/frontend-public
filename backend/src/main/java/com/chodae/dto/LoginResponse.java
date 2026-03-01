package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class LoginResponse {
    UserResponse user;
    String token;
}

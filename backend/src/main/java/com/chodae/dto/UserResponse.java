package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;

@Value
@Builder
public class UserResponse {
    Integer id;
    String userId;
    String username;
    String nickname;
    String phone;
    String church;
    LocalDate birthday;
    String descr;
    UserLevel level;
}

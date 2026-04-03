package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;

@Value
@Builder
public class UserResponse {
    Integer id;
    String userId;
    String userName;
    String nickName;
    String phone;
    String church;
    LocalDate birthday;
    String description;
    UserLevel level;
}

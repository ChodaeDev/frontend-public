package com.chodae.dto;

import lombok.Data;

@Data
public class UserRegisterRequest {
    private String userId;
    private String username;
    private String password;
    private String nickname;
    private String phone;
    private String church;
    private String birthday; // ISO-8601 (yyyy-MM-dd)
    private String descr;
}

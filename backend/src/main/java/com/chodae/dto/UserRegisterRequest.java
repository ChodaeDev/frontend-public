package com.chodae.dto;

import lombok.Data;

@Data
public class UserRegisterRequest {
    private String userId;
    private String userName;
    private String password;
    private String nickName;
    private String phone;
    private String church;
    private String birthday; // ISO-8601 (yyyy-MM-dd)
    private String description;
}

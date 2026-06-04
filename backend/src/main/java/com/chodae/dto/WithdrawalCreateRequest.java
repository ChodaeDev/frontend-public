package com.chodae.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class WithdrawalCreateRequest {
    private String title;
    private String content;
    private String userId;
    private String userName;
    private String visibilityLevel;
    private String subMenu;
    private String phone;
    private String counselType;
}

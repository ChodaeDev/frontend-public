package com.chodae.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ScjInfoCreateRequest {
    private String title;
    private String content;
    private String userId;
    private String userName;
    private String phone;
    private String counselType;
}

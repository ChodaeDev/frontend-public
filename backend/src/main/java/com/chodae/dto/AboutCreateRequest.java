package com.chodae.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AboutCreateRequest {
    private String title;
    private String content;
    private String userId;
    private String userName;
    private String phone;
    private String counselType;
}

package com.chodae.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CounselingCreateRequest {
    private String title;
    private String content;
    private String userId;
    private String userName;
    private Boolean isPrivate;
    private String phone;
    private String counselType;
}

package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class CounselingResponse {
    Integer id;
    String title;
    String content;
    String userId;
    String userName;
    String phone;
    String counselType;
    Integer commentCount;
    String visibilityLevel;
    LocalDateTime createDate;
    LocalDateTime modifiedDate;
}

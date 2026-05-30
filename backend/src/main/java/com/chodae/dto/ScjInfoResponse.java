package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class ScjInfoResponse {
    Integer id;
    String title;
    String content;
    String userId;
    String userName;
    String phone;
    String counselType;
    Integer commentCount;
    Integer visibilityLevel;
    LocalDateTime createDate;
    LocalDateTime modifiedDate;
}

package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class AboutResponse {
    Integer id;
    String mainMenu;
    String subMenu;
    String title;
    String content;
    String userId;
    String userName;
    String phone;
    String counselType;
    Integer commentCount;
    String visibilityLevel;
    Boolean isNotice;
    LocalDateTime createDate;
    LocalDateTime modifiedDate;
}

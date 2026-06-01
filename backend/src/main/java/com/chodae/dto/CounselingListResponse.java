package com.chodae.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class CounselingListResponse {
    Integer id;
    String mainMenu;
    String subMenu;
    String title;
    @JsonIgnore
    String userId;
    String userName;
    Boolean isOwner;
    String counselType;
    Integer commentCount;
    String visibilityLevel;
    Boolean isNotice;
    LocalDateTime createDate;
    LocalDateTime modifiedDate;
}

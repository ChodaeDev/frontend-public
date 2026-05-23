package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class CounselingListResponse {
    Integer id;
    String title;
    String counselType;
    Integer commentCount;
    Integer isPrivate;
    LocalDateTime createDate;
    LocalDateTime modifiedDate;
}

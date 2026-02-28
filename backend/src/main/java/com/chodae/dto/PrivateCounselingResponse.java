package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class PrivateCounselingResponse {
    Integer id;
    String title;
    String content;
    String authorId;
    String authorName;
    String phone;
    String counselType;
    Integer commentCount;
    Integer privateNum;
    LocalDateTime regDt;
    LocalDateTime updDt;
}

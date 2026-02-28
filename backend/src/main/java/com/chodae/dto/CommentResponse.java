package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class CommentResponse {
    Integer id;
    String authorId;
    String authorName;
    String content;
    Integer privateNum;
    String confirm;
    LocalDateTime regDt;
}

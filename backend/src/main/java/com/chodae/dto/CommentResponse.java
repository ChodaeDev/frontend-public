package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class CommentResponse {
    Integer id;
    Integer postId;
    String userId;
    String userName;
    String content;
    String visibilityLevel;
    String confirm;
    LocalDateTime createDate;
    LocalDateTime modifiedDate;
}

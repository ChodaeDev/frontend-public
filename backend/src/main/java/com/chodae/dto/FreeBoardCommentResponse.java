package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class FreeBoardCommentResponse {
    Integer id;
    Integer postId;
    Integer parentCommentId;
    String userId;
    String userName;
    String content;
    String visibilityLevel;
    String confirm;
    LocalDateTime createDate;
    LocalDateTime modifiedDate;
}

package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class FreeBoardCommentResponse {
    Integer id;
    String userId;
    String userName;
    String content;
    Integer isPrivate;
    String confirm;
    LocalDateTime createDate;
}

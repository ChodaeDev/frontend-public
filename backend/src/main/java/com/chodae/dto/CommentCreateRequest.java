package com.chodae.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CommentCreateRequest {
    private String authorId;
    private String authorName;
    private String content;
}

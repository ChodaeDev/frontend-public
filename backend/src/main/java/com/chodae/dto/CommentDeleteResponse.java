package com.chodae.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 상담 댓글 삭제 API 응답 본문
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDeleteResponse {
    /** 삭제된 댓글 ID */
    private Integer id;
}


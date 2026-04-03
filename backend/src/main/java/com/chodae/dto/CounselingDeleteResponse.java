package com.chodae.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 상담게시글 삭제 API 응답 본문
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CounselingDeleteResponse {
    /** 삭제된 상담 글 ID */
    private Integer id;
}

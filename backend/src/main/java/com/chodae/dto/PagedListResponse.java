package com.chodae.dto;

import lombok.Builder;
import lombok.Value;

import java.util.List;

/**
 * 페이징된 목록 응답 (공통)
 *
 * @param <T> 목록 아이템 타입
 */
@Value
@Builder
public class PagedListResponse<T> {
    List<T> items;

    /** 현재 페이지 (1부터 시작) */
    int pageNumber;

    /** 페이지네이션 UI에 표시할 페이지 번호 개수 (보통 5개 또는 10개) */
    int pageSize;

    /** 데이터 전체 개수 */
    long itemTotal;

    /** 정렬 기준 (예: "regDt_desc", "regDt_asc" 등) */
    String sorting;

    /** 한 페이지당 표시할 데이터 개수 (보통 10~50개) */
    int itemCount;

    /** 전체 페이지 개수 */
    int totalPages;
}

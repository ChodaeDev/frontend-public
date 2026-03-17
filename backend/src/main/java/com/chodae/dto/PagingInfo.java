package com.chodae.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Value;

/**
 * API 응답의 paging 객체 (pageNumber, pageSize, itemTotal, sorting, itemCount, totalPages)
 */
@Value
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class PagingInfo {
    int pageNumber;
    int pageSize;
    long itemTotal;
    String sorting;
    int itemCount;
    int totalPages;

    public static PagingInfo from(PagedListResponse<?> paged) {
        return PagingInfo.builder()
                .pageNumber(paged.getPageNumber())
                .pageSize(paged.getPageSize())
                .itemTotal(paged.getItemTotal())
                .sorting(paged.getSorting())
                .itemCount(paged.getItemCount())
                .totalPages(paged.getTotalPages())
                .build();
    }
}

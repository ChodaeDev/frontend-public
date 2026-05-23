package com.chodae.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Value;

/**
 * API 응답의 paging 객체 (pageNumber, pageSize, itemTotal, sortBy, sortDirection, itemCount, totalPages)
 */
@Value
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class PagingInfo {
    int pageNumber;
    int pageSize;
    long itemTotal;
    String sortBy;
    String sortDirection;
    int itemCount;
    int totalPages;

    public static PagingInfo from(PagedListResponse<?> paged) {
        return PagingInfo.builder()
                .pageNumber(paged.getPageNumber())
                .pageSize(paged.getPageSize())
                .itemTotal(paged.getItemTotal())
                .sortBy(resolveSortBy(paged))
                .sortDirection(resolveSortDirection(paged))
                .itemCount(paged.getItemCount())
                .totalPages(paged.getTotalPages())
                .build();
    }

    private static String resolveSortBy(PagedListResponse<?> paged) {
        if (paged.getSortBy() != null && !paged.getSortBy().isBlank()) {
            return paged.getSortBy();
        }
        String sorting = paged.getSorting();
        if (sorting == null || sorting.isBlank()) {
            return "createDate";
        }
        int separatorIndex = sorting.lastIndexOf('_');
        return separatorIndex > 0 ? sorting.substring(0, separatorIndex) : sorting;
    }

    private static String resolveSortDirection(PagedListResponse<?> paged) {
        if (paged.getSortDirection() != null && !paged.getSortDirection().isBlank()) {
            return paged.getSortDirection();
        }
        String sorting = paged.getSorting();
        if (sorting == null || sorting.isBlank()) {
            return "desc";
        }
        int separatorIndex = sorting.lastIndexOf('_');
        return separatorIndex >= 0 && separatorIndex < sorting.length() - 1
                ? sorting.substring(separatorIndex + 1)
                : "desc";
    }
}

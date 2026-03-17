package com.chodae.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 페이징 목록 API 공통 응답 형식
 * - timestamp, status, path, paging, payload
 */
@Value
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class PagedApiResponse<T> {
    String timestamp;
    int status;
    String path;
    PagingInfo paging;
    List<T> payload;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static <T> PagedApiResponse<T> of(int status, String path, PagedListResponse<T> pagedList) {
        return PagedApiResponse.<T>builder()
                .timestamp(LocalDateTime.now().format(FORMATTER))
                .status(status)
                .path(path)
                .paging(PagingInfo.from(pagedList))
                .payload(pagedList.getItems())
                .build();
    }

    public static <T> PagedApiResponse<T> of(int status, String path, PagingInfo paging, List<T> payload) {
        return PagedApiResponse.<T>builder()
                .timestamp(LocalDateTime.now().format(FORMATTER))
                .status(status)
                .path(path)
                .paging(paging)
                .payload(payload)
                .build();
    }
}

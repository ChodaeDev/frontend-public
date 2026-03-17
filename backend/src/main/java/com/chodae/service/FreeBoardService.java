package com.chodae.service;

import com.chodae.dto.FreeBoardCreateRequest;
import com.chodae.dto.FreeBoardResponse;
import com.chodae.dto.PagedListResponse;
import com.chodae.dto.FreeBoardCommentResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.mapper.FreeBoardCommentMapper;
import com.chodae.mapper.FreeBoardPostMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class FreeBoardService {

    private final FreeBoardPostMapper freeBoardPostMapper;
    private final FreeBoardCommentMapper freeBoardCommentMapper;

    public List<FreeBoardResponse> findAll() {
        return freeBoardPostMapper.findAll();
    }

    /**
     * 페이징된 목록 조회
     * @param pageNumber 현재 페이지 (1부터 시작)
     * @param itemCount 한 페이지당 표시할 데이터 개수
     * @param pageSize 페이지네이션 UI에 표시할 페이지 번호 개수
     * @param sorting 정렬 (예: "createDate_desc", "createDate_asc", "title_asc", "title_desc", "commentCount_desc")
     */
    public PagedListResponse<FreeBoardResponse> findAllWithPaging(int pageNumber, int itemCount, int pageSize, String sorting) {
        long itemTotal = freeBoardPostMapper.countAll();
        int totalPages = itemTotal > 0 ? (int) Math.ceil((double) itemTotal / itemCount) : 0;

        String sortColumn = "create_date";
        String sortOrder = "DESC";
        if (sorting != null && !sorting.isBlank()) {
            String[] parts = sorting.split("_");
            if (parts.length == 2) {
                switch (parts[0].toLowerCase()) {
                    case "title" -> sortColumn = "title";
                    case "commentcount" -> sortColumn = "comment_count";
                    case "regdt" -> sortColumn = "create_date";
                    default -> { /* keep default */ }
                }
                sortOrder = "asc".equalsIgnoreCase(parts[1]) ? "ASC" : "DESC";
            }
        }

        int offset = Math.max(0, (pageNumber - 1) * itemCount);
        List<FreeBoardResponse> items = freeBoardPostMapper.findAllWithPaging(offset, itemCount, sortColumn, sortOrder);

        return PagedListResponse.<FreeBoardResponse>builder()
                .items(items)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .itemTotal(itemTotal)
                .sorting(sorting != null ? sorting : "createDate_desc")
                .itemCount(itemCount)
                .totalPages(totalPages)
                .build();
    }

    public FreeBoardResponse findById(Integer id) {
        return freeBoardPostMapper.findById(id);
    }

    public FreeBoardResponse findByIdAndUserId(Integer id, String userId) {
        return freeBoardPostMapper.findByIdAndUserId(id, userId);
    }

    @Transactional
    public FreeBoardResponse create(FreeBoardCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("userId", request.getUserId());
        params.put("userName", request.getUserName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("isPrivate", 0);

        freeBoardPostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        freeBoardPostMapper.updateIsPrivate(id, id);
        FreeBoardResponse created = freeBoardPostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<FreeBoardCommentResponse> findCommentsByPostId(Integer postId) {
        return freeBoardCommentMapper.findByIsPrivate(postId);
    }

    @Transactional
    public FreeBoardCommentResponse addComment(Integer postId, CommentCreateRequest request) {
        FreeBoardResponse post = freeBoardPostMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("userId", request.getUserId());
        params.put("userName", request.getUserName() != null ? request.getUserName() : "익명");
        params.put("content", request.getContent());
        params.put("isPrivate", postId);
        params.put("confirm", "N");

        freeBoardCommentMapper.insert(params);
        Integer commentId = (Integer) params.get("id");

        int count = freeBoardCommentMapper.countByIsPrivate(postId);
        freeBoardPostMapper.updateCommentCount(postId, count);

        return freeBoardCommentMapper.findById(commentId);
    }
}

package com.chodae.service;

import com.chodae.dto.AboutCreateRequest;
import com.chodae.dto.AboutResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.PagedListResponse;
import com.chodae.mapper.AboutCommentMapper;
import com.chodae.mapper.AboutPostMapper;
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
public class AboutService {

    private final AboutPostMapper aboutPostMapper;
    private final AboutCommentMapper aboutCommentMapper;
    private final AccessControlService accessControlService;

    public List<AboutResponse> findAll() {
        return aboutPostMapper.findAll();
    }

    public PagedListResponse<AboutResponse> findAllWithPaging(int pageNumber, int itemCount, int pageSize, String sorting) {
        long itemTotal = aboutPostMapper.countAll();
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
        List<AboutResponse> items = aboutPostMapper.findAllWithPaging(offset, itemCount, sortColumn, sortOrder);

        return PagedListResponse.<AboutResponse>builder()
                .items(items)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .itemTotal(itemTotal)
                .sorting(sorting != null ? sorting : "createDate_desc")
                .itemCount(itemCount)
                .totalPages(totalPages)
                .build();
    }

    public List<AboutResponse> findByUserId(String userId) {
        return aboutPostMapper.findByUserId(userId);
    }

    public AboutResponse findById(Integer id) {
        return aboutPostMapper.findById(id);
    }

    public AboutResponse findByIdAndUserId(Integer id, String userId) {
        if (accessControlService.isSuperAdmin(userId)) {
            return aboutPostMapper.findById(id);
        }
        return aboutPostMapper.findByIdAndUserId(id, userId);
    }

    @Transactional
    public AboutResponse create(AboutCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("userId", request.getUserId());
        params.put("userName", request.getUserName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("visibilityLevel", 0);

        aboutPostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        aboutPostMapper.updateVisibilityLevel(id, id);
        AboutResponse created = aboutPostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return aboutCommentMapper.findByVisibilityLevel(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        AboutResponse post = aboutPostMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("userId", request.getUserId());
        params.put("userName", request.getUserName() != null ? request.getUserName() : "익명");
        params.put("content", request.getContent());
        params.put("visibilityLevel", postId);
        params.put("confirm", "N");

        aboutCommentMapper.insert(params);
        Object commentIdObj = params.get("id");
        Integer commentId = commentIdObj instanceof Number ? ((Number) commentIdObj).intValue() : null;
        if (commentId == null) {
            throw new IllegalStateException("댓글 등록 후 ID를 가져오지 못했습니다.");
        }

        int count = aboutCommentMapper.countByVisibilityLevel(postId);
        aboutPostMapper.updateCommentCount(postId, count);

        return aboutCommentMapper.findById(commentId);
    }
}

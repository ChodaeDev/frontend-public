package com.chodae.service;

import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.PagedListResponse;
import com.chodae.dto.WithdrawalCreateRequest;
import com.chodae.dto.WithdrawalResponse;
import com.chodae.mapper.WithdrawalCommentMapper;
import com.chodae.mapper.WithdrawalPostMapper;
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
public class WithdrawalService {

    private final WithdrawalPostMapper withdrawalPostMapper;
    private final WithdrawalCommentMapper withdrawalCommentMapper;
    private final AccessControlService accessControlService;

    public List<WithdrawalResponse> findAll() {
        return withdrawalPostMapper.findAll();
    }

    public PagedListResponse<WithdrawalResponse> findAllWithPaging(int pageNumber, int itemCount, int pageSize, String sorting) {
        long itemTotal = withdrawalPostMapper.countAll();
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
        List<WithdrawalResponse> items = withdrawalPostMapper.findAllWithPaging(offset, itemCount, sortColumn, sortOrder);

        return PagedListResponse.<WithdrawalResponse>builder()
                .items(items)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .itemTotal(itemTotal)
                .sorting(sorting != null ? sorting : "createDate_desc")
                .itemCount(itemCount)
                .totalPages(totalPages)
                .build();
    }

    public WithdrawalResponse findById(Integer id) {
        return withdrawalPostMapper.findById(id);
    }

    public WithdrawalResponse findByIdAndUserId(Integer id, String userId) {
        if (accessControlService.isSuperAdmin(userId)) {
            return withdrawalPostMapper.findById(id);
        }
        return withdrawalPostMapper.findByIdAndUserId(id, userId);
    }

    @Transactional
    public WithdrawalResponse create(WithdrawalCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("userId", request.getUserId());
        params.put("userName", request.getUserName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("visibilityLevel", request.getVisibilityLevel());

        withdrawalPostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        WithdrawalResponse created = withdrawalPostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return withdrawalCommentMapper.findByVisibilityLevel(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        WithdrawalResponse post = withdrawalPostMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("userId", request.getUserId());
        params.put("userName", request.getUserName() != null ? request.getUserName() : "익명");
        params.put("content", request.getContent());
        params.put("postId", postId);
        Integer parentCommentId = resolveParentCommentId(postId, request.getParentCommentId());
        params.put("parentCommentId", parentCommentId);
        params.put("visibilityLevel", request.getVisibilityLevel());
        params.put("confirm", "N");

        withdrawalCommentMapper.insert(params);
        Object commentIdObj = params.get("id");
        Integer commentId = commentIdObj instanceof Number ? ((Number) commentIdObj).intValue() : null;
        if (commentId == null) {
            throw new IllegalStateException("댓글 등록 후 ID를 가져오지 못했습니다.");
        }

        int count = withdrawalCommentMapper.countByVisibilityLevel(postId);
        withdrawalPostMapper.updateCommentCount(postId, count);

        return withdrawalCommentMapper.findById(commentId);
    }

    private Integer resolveParentCommentId(Integer postId, Integer parentCommentId) {
        if (parentCommentId == null) {
            return null;
        }
        CommentResponse parent = withdrawalCommentMapper.findById(parentCommentId);
        if (parent == null || !postId.equals(parent.getPostId())) {
            throw new IllegalArgumentException("부모 댓글이 존재하지 않습니다.");
        }
        if (parent.getParentCommentId() != null) {
            throw new IllegalArgumentException("대댓글에는 답글을 작성할 수 없습니다.");
        }
        return parentCommentId;
    }
}

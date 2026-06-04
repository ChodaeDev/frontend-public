package com.chodae.service;

import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentDeleteResponse;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.CounselingDeleteResponse;
import com.chodae.dto.PagedListResponse;
import com.chodae.dto.WithdrawalCreateRequest;
import com.chodae.dto.WithdrawalResponse;
import com.chodae.mapper.CommentMapper;
import com.chodae.mapper.PostAttachMapper;
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
    private final CommentMapper commentMapper;
    private final PostAttachMapper postAttachMapper;
    private final AccessControlService accessControlService;

    public List<WithdrawalResponse> findAll() {
        return withdrawalPostMapper.findAll();
    }

    public PagedListResponse<WithdrawalResponse> findAllWithPaging(int pageNumber, int itemCount, int pageSize, String sorting) {
        return findAllWithPaging(null, pageNumber, itemCount, pageSize, sorting);
    }

    public PagedListResponse<WithdrawalResponse> findAllWithPaging(String subMenu, int pageNumber, int itemCount, int pageSize, String sorting) {
        long itemTotal = withdrawalPostMapper.countAll(subMenu);
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
        List<WithdrawalResponse> items = withdrawalPostMapper.findAllWithPaging(subMenu, offset, itemCount, sortColumn, sortOrder);

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
        if (accessControlService.isAdminOrSuperAdmin(userId)) {
            return withdrawalPostMapper.findById(id);
        }
        return withdrawalPostMapper.findByIdAndUserId(id, userId);
    }

    public WithdrawalResponse findByIdForBoard(String subMenu, Integer id) {
        WithdrawalResponse post = withdrawalPostMapper.findById(id);
        if (post == null || !subMenu.equals(post.getSubMenu())) {
            return null;
        }
        return post;
    }

    @Transactional
    public WithdrawalResponse create(WithdrawalCreateRequest request) {
        requireManagePermissionIfManagedBoard(request.getSubMenu(), request.getUserId());
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("userId", request.getUserId());
        params.put("userName", request.getUserName());
        params.put("subMenu", request.getSubMenu());
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

    @Transactional
    public WithdrawalResponse edit(String subMenu, Integer id, WithdrawalCreateRequest request) {
        requireManagePermissionIfManagedBoard(subMenu, request.getUserId());
        validateManagedPost(subMenu, id);

        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("visibilityLevel", request.getVisibilityLevel());

        int updated = withdrawalPostMapper.updateById(id, params);
        if (updated == 0) {
            throw new IllegalStateException("글 수정에 실패했습니다.");
        }
        return withdrawalPostMapper.findById(id);
    }

    @Transactional
    public CounselingDeleteResponse deletePostById(String subMenu, Integer postId, String userId) {
        requireManagePermissionIfManagedBoard(subMenu, userId);
        validateManagedPost(subMenu, postId);

        postAttachMapper.deleteAttachmentsByPostId(postId);
        commentMapper.deleteCommentsByPostId(postId);
        int deleted = withdrawalPostMapper.deletePostById(postId);
        if (deleted == 0) {
            throw new IllegalStateException("글 삭제에 실패했습니다.");
        }
        return new CounselingDeleteResponse(postId);
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return withdrawalCommentMapper.findByVisibilityLevel(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        requireManagePermissionIfManagedBoard(request.getSubMenu(), request.getUserId());
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

    @Transactional
    public CommentResponse updateComment(String subMenu, Integer postId, Integer commentId, CommentCreateRequest request) {
        requireManagePermissionIfManagedBoard(subMenu, request.getUserId());
        validateManagedPost(subMenu, postId);
        validateComment(postId, commentId);

        int updated = commentMapper.updateComment(commentId, request.getUserId(), request.getContent(), true);
        if (updated == 0) {
            throw new IllegalStateException("댓글 수정에 실패했습니다.");
        }
        return commentMapper.findById(commentId);
    }

    @Transactional
    public CommentDeleteResponse deleteComment(String subMenu, Integer postId, Integer commentId, String userId) {
        requireManagePermissionIfManagedBoard(subMenu, userId);
        validateManagedPost(subMenu, postId);
        validateComment(postId, commentId);

        int deleted = commentMapper.deleteComment(commentId, userId, postId, true);
        if (deleted == 0) {
            throw new IllegalStateException("댓글 삭제에 실패했습니다.");
        }
        int count = commentMapper.countCommentsByPostId(postId);
        withdrawalPostMapper.updateCommentCount(postId, count);
        return new CommentDeleteResponse(commentId);
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

    private void validateManagedPost(String subMenu, Integer postId) {
        WithdrawalResponse post = withdrawalPostMapper.findById(postId);
        if (post == null || !subMenu.equals(post.getSubMenu())) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }
    }

    private void validateComment(Integer postId, Integer commentId) {
        CommentResponse comment = commentMapper.findById(commentId);
        if (comment == null || !postId.equals(comment.getPostId())) {
            throw new IllegalArgumentException("댓글이 존재하지 않습니다.");
        }
    }

    private void requireManagePermissionIfManagedBoard(String subMenu, String userId) {
        if (isManagedBoard(subMenu) && !accessControlService.isAdminOrSuperAdmin(userId)) {
            throw new IllegalArgumentException("관리자 권한이 필요합니다.");
        }
    }

    private boolean isManagedBoard(String subMenu) {
        return "damage-cases".equals(subMenu);
    }
}

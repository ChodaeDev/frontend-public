package com.chodae.service;

import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentDeleteResponse;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.CounselingDeleteResponse;
import com.chodae.dto.PagedListResponse;
import com.chodae.dto.PreventionCreateRequest;
import com.chodae.dto.PreventionResponse;
import com.chodae.mapper.CommentMapper;
import com.chodae.mapper.PostAttachMapper;
import com.chodae.mapper.PreventionCommentMapper;
import com.chodae.mapper.PreventionPostMapper;
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
public class PreventionService {

    private final PreventionPostMapper preventionPostMapper;
    private final PreventionCommentMapper preventionCommentMapper;
    private final CommentMapper commentMapper;
    private final PostAttachMapper postAttachMapper;
    private final AccessControlService accessControlService;

    public List<PreventionResponse> findAll() {
        return preventionPostMapper.findAll();
    }

    public PagedListResponse<PreventionResponse> findAllWithPaging(int pageNumber, int itemCount, int pageSize, String sorting) {
        return findAllWithPaging(null, pageNumber, itemCount, pageSize, sorting);
    }

    public PagedListResponse<PreventionResponse> findAllWithPaging(String subMenu, int pageNumber, int itemCount, int pageSize, String sorting) {
        long itemTotal = preventionPostMapper.countAll(subMenu);
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
        List<PreventionResponse> items = preventionPostMapper.findAllWithPaging(subMenu, offset, itemCount, sortColumn, sortOrder);

        return PagedListResponse.<PreventionResponse>builder()
                .items(items)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .itemTotal(itemTotal)
                .sorting(sorting != null ? sorting : "createDate_desc")
                .itemCount(itemCount)
                .totalPages(totalPages)
                .build();
    }

    public PreventionResponse findById(Integer id) {
        return preventionPostMapper.findById(id);
    }

    public PreventionResponse findByIdAndUserId(Integer id, String userId) {
        if (accessControlService.isAdminOrSuperAdmin(userId)) {
            return preventionPostMapper.findById(id);
        }
        return preventionPostMapper.findByIdAndUserId(id, userId);
    }

    public PreventionResponse findByIdForBoard(String subMenu, Integer id) {
        PreventionResponse post = preventionPostMapper.findById(id);
        if (post == null || !subMenu.equals(post.getSubMenu())) {
            return null;
        }
        return post;
    }

    @Transactional
    public PreventionResponse create(PreventionCreateRequest request) {
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

        preventionPostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        PreventionResponse created = preventionPostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    @Transactional
    public PreventionResponse edit(String subMenu, Integer id, PreventionCreateRequest request) {
        requireManagePermissionIfManagedBoard(subMenu, request.getUserId());
        validateManagedPost(subMenu, id);

        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("visibilityLevel", request.getVisibilityLevel());

        int updated = preventionPostMapper.updateById(id, params);
        if (updated == 0) {
            throw new IllegalStateException("글 수정에 실패했습니다.");
        }
        return preventionPostMapper.findById(id);
    }

    @Transactional
    public CounselingDeleteResponse deletePostById(String subMenu, Integer postId, String userId) {
        requireManagePermissionIfManagedBoard(subMenu, userId);
        validateManagedPost(subMenu, postId);

        postAttachMapper.deleteAttachmentsByPostId(postId);
        commentMapper.deleteCommentsByPostId(postId);
        int deleted = preventionPostMapper.deletePostById(postId);
        if (deleted == 0) {
            throw new IllegalStateException("글 삭제에 실패했습니다.");
        }
        return new CounselingDeleteResponse(postId);
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return preventionCommentMapper.findByVisibilityLevel(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        requireManagePermissionIfManagedBoard(request.getSubMenu(), request.getUserId());
        PreventionResponse post = preventionPostMapper.findById(postId);
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

        preventionCommentMapper.insert(params);
        Object commentIdObj = params.get("id");
        Integer commentId = commentIdObj instanceof Number ? ((Number) commentIdObj).intValue() : null;
        if (commentId == null) {
            throw new IllegalStateException("댓글 등록 후 ID를 가져오지 못했습니다.");
        }

        int count = preventionCommentMapper.countByVisibilityLevel(postId);
        preventionPostMapper.updateCommentCount(postId, count);

        return preventionCommentMapper.findById(commentId);
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
        preventionPostMapper.updateCommentCount(postId, count);
        return new CommentDeleteResponse(commentId);
    }

    private Integer resolveParentCommentId(Integer postId, Integer parentCommentId) {
        if (parentCommentId == null) {
            return null;
        }
        CommentResponse parent = preventionCommentMapper.findById(parentCommentId);
        if (parent == null || !postId.equals(parent.getPostId())) {
            throw new IllegalArgumentException("부모 댓글이 존재하지 않습니다.");
        }
        if (parent.getParentCommentId() != null) {
            throw new IllegalArgumentException("대댓글에는 답글을 작성할 수 없습니다.");
        }
        return parentCommentId;
    }

    private void validateManagedPost(String subMenu, Integer postId) {
        PreventionResponse post = preventionPostMapper.findById(postId);
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
        return "resources".equals(subMenu);
    }
}

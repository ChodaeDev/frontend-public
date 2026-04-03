package com.chodae.service;

import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CounselingDeleteResponse;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.PagedListResponse;
import com.chodae.dto.CounselingCreateRequest;
import com.chodae.dto.CounselingResponse;
import com.chodae.mapper.CommentMapper;
import com.chodae.mapper.CounselingMapper;
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
public class CounselingService {

    private final CounselingMapper counselingMapper;
    private final CommentMapper commentMapper;

    public List<CounselingResponse> findAll() {
        return counselingMapper.findAll();
    }

    public PagedListResponse<CounselingResponse> findAllWithPaging(int pageNumber, int itemCount, int pageSize, String sorting) {
        long itemTotal = counselingMapper.countAll();
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
        List<CounselingResponse> items = counselingMapper.findAllWithPaging(offset, itemCount, sortColumn, sortOrder);

        return PagedListResponse.<CounselingResponse>builder()
                .items(items)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .itemTotal(itemTotal)
                .sorting(sorting != null ? sorting : "createDate_desc")
                .itemCount(itemCount)
                .totalPages(totalPages)
                .build();
    }

    public List<CounselingResponse> findByUserId(String userId) {
        return counselingMapper.findByUserId(userId);
    }

    public CounselingResponse findById(Integer id) {
        return counselingMapper.findById(id);
    }

    public CounselingResponse findByIdAndUserId(Integer id, String userId) {
        return counselingMapper.findByIdAndUserId(id, userId);
    }

    @Transactional
    public CounselingResponse create(CounselingCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("userId", request.getUserId());
        params.put("userName", request.getUserName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("isPrivate", 0);

        counselingMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("상담 글 등록 후 ID를 가져오지 못했습니다.");
        }
        counselingMapper.updateIsPrivate(id, id);
        CounselingResponse created = counselingMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 상담 글을 조회할 수 없습니다.");
        }
        return created;
    }

    @Transactional
    public CounselingResponse edit(Integer id, CounselingCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());

        counselingMapper.updateById(id, params);
        return counselingMapper.findById(id);
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return commentMapper.findByIsPrivate(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        CounselingResponse post = counselingMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("상담 글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("userId", request.getUserId());
        params.put("userName", request.getUserName() != null ? request.getUserName() : "익명");
        params.put("content", request.getContent());
        params.put("isPrivate", postId);
        params.put("confirm", "N");

        commentMapper.insert(params);
        Integer commentId = (Integer) params.get("id");

        int count = commentMapper.countByIsPrivate(postId);
        counselingMapper.updateCommentCount(postId, count);

        return commentMapper.findById(commentId);
    }

    /**
     * 상담 글 삭제 (작성자 본인만). 연관 댓글(comments.is_private = 글 ID) 선삭제 후 글 삭제.
     */
    @Transactional
    public CounselingDeleteResponse deleteById(Integer id) {
        CounselingResponse post = counselingMapper.findById(id);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않거나 삭제 권한이 없습니다.");
        }
        commentMapper.deleteByIsPrivate(id);
        int deleted = counselingMapper.deleteById(id);
        if (deleted == 0) {
            throw new IllegalStateException("상담 글 삭제에 실패했습니다.");
        }
        return new CounselingDeleteResponse(id);
    }
}

package com.chodae.service;

import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.DoctrineCreateRequest;
import com.chodae.dto.DoctrineResponse;
import com.chodae.dto.PagedListResponse;
import com.chodae.mapper.DoctrineCommentMapper;
import com.chodae.mapper.DoctrinePostMapper;
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
public class DoctrineService {

    private final DoctrinePostMapper doctrinePostMapper;
    private final DoctrineCommentMapper doctrineCommentMapper;
    private final AccessControlService accessControlService;

    public List<DoctrineResponse> findAll() {
        return doctrinePostMapper.findAll();
    }

    public PagedListResponse<DoctrineResponse> findAllWithPaging(int pageNumber, int itemCount, int pageSize, String sorting) {
        long itemTotal = doctrinePostMapper.countAll();
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
        List<DoctrineResponse> items = doctrinePostMapper.findAllWithPaging(offset, itemCount, sortColumn, sortOrder);

        return PagedListResponse.<DoctrineResponse>builder()
                .items(items)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .itemTotal(itemTotal)
                .sorting(sorting != null ? sorting : "createDate_desc")
                .itemCount(itemCount)
                .totalPages(totalPages)
                .build();
    }

    public DoctrineResponse findById(Integer id) {
        return doctrinePostMapper.findById(id);
    }

    public DoctrineResponse findByIdAndUserId(Integer id, String userId) {
        if (accessControlService.isSuperAdmin(userId)) {
            return doctrinePostMapper.findById(id);
        }
        return doctrinePostMapper.findByIdAndUserId(id, userId);
    }

    @Transactional
    public DoctrineResponse create(DoctrineCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("userId", request.getUserId());
        params.put("userName", request.getUserName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("isPrivate", 0);

        doctrinePostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        doctrinePostMapper.updateIsPrivate(id, id);
        DoctrineResponse created = doctrinePostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return doctrineCommentMapper.findByIsPrivate(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        DoctrineResponse post = doctrinePostMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("userId", request.getUserId());
        params.put("userName", request.getUserName() != null ? request.getUserName() : "익명");
        params.put("content", request.getContent());
        params.put("isPrivate", postId);
        params.put("confirm", "N");

        doctrineCommentMapper.insert(params);
        Object commentIdObj = params.get("id");
        Integer commentId = commentIdObj instanceof Number ? ((Number) commentIdObj).intValue() : null;
        if (commentId == null) {
            throw new IllegalStateException("댓글 등록 후 ID를 가져오지 못했습니다.");
        }

        int count = doctrineCommentMapper.countByIsPrivate(postId);
        doctrinePostMapper.updateCommentCount(postId, count);

        return doctrineCommentMapper.findById(commentId);
    }
}

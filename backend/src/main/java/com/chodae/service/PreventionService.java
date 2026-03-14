package com.chodae.service;

import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.PreventionCreateRequest;
import com.chodae.dto.PreventionResponse;
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

    public List<PreventionResponse> findAll() {
        return preventionPostMapper.findAll();
    }

    public PreventionResponse findById(Integer id) {
        return preventionPostMapper.findById(id);
    }

    public PreventionResponse findByIdAndAuthorId(Integer id, String authorId) {
        return preventionPostMapper.findByIdAndAuthorId(id, authorId);
    }

    @Transactional
    public PreventionResponse create(PreventionCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("privateNum", 0);

        preventionPostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        preventionPostMapper.updatePrivateNum(id, id);
        PreventionResponse created = preventionPostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return preventionCommentMapper.findByPrivateNum(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        PreventionResponse post = preventionPostMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName() != null ? request.getAuthorName() : "익명");
        params.put("content", request.getContent());
        params.put("privateNum", postId);
        params.put("confirm", "N");

        preventionCommentMapper.insert(params);
        Integer commentId = (Integer) params.get("id");

        int count = preventionCommentMapper.countByPrivateNum(postId);
        preventionPostMapper.updateCommentCount(postId, count);

        return preventionCommentMapper.findById(commentId);
    }
}

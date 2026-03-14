package com.chodae.service;

import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.ScjInfoCreateRequest;
import com.chodae.dto.ScjInfoResponse;
import com.chodae.mapper.ScjInfoCommentMapper;
import com.chodae.mapper.ScjInfoPostMapper;
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
public class ScjInfoService {

    private final ScjInfoPostMapper scjInfoPostMapper;
    private final ScjInfoCommentMapper scjInfoCommentMapper;

    public List<ScjInfoResponse> findAll() {
        return scjInfoPostMapper.findAll();
    }

    public ScjInfoResponse findById(Integer id) {
        return scjInfoPostMapper.findById(id);
    }

    public ScjInfoResponse findByIdAndAuthorId(Integer id, String authorId) {
        return scjInfoPostMapper.findByIdAndAuthorId(id, authorId);
    }

    @Transactional
    public ScjInfoResponse create(ScjInfoCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("privateNum", 0);

        scjInfoPostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        scjInfoPostMapper.updatePrivateNum(id, id);
        ScjInfoResponse created = scjInfoPostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return scjInfoCommentMapper.findByPrivateNum(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        ScjInfoResponse post = scjInfoPostMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName() != null ? request.getAuthorName() : "익명");
        params.put("content", request.getContent());
        params.put("privateNum", postId);
        params.put("confirm", "N");

        scjInfoCommentMapper.insert(params);
        Integer commentId = (Integer) params.get("id");

        int count = scjInfoCommentMapper.countByPrivateNum(postId);
        scjInfoPostMapper.updateCommentCount(postId, count);

        return scjInfoCommentMapper.findById(commentId);
    }
}

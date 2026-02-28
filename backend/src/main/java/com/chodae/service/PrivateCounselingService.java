package com.chodae.service;

import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.PrivateCounselingCreateRequest;
import com.chodae.dto.PrivateCounselingResponse;
import com.chodae.mapper.CommentMapper;
import com.chodae.mapper.PrivateCounselingMapper;
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
public class PrivateCounselingService {

    private final PrivateCounselingMapper privateCounselingMapper;
    private final CommentMapper commentMapper;

    public List<PrivateCounselingResponse> findAll() {
        return privateCounselingMapper.findAll();
    }

    public PrivateCounselingResponse findById(Integer id) {
        return privateCounselingMapper.findById(id);
    }

    @Transactional
    public PrivateCounselingResponse create(PrivateCounselingCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("privateNum", 0);

        privateCounselingMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("상담 글 등록 후 ID를 가져오지 못했습니다.");
        }
        privateCounselingMapper.updatePrivateNum(id, id);
        PrivateCounselingResponse created = privateCounselingMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 상담 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return commentMapper.findByPrivateNum(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        PrivateCounselingResponse post = privateCounselingMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("상담 글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName() != null ? request.getAuthorName() : "익명");
        params.put("content", request.getContent());
        params.put("privateNum", postId);
        params.put("confirm", "N");

        commentMapper.insert(params);
        Integer commentId = (Integer) params.get("id");

        int count = commentMapper.countByPrivateNum(postId);
        privateCounselingMapper.updateCommentCount(postId, count);

        return commentMapper.findById(commentId);
    }
}

package com.chodae.service;

import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
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

    public List<WithdrawalResponse> findAll() {
        return withdrawalPostMapper.findAll();
    }

    public WithdrawalResponse findById(Integer id) {
        return withdrawalPostMapper.findById(id);
    }

    public WithdrawalResponse findByIdAndAuthorId(Integer id, String authorId) {
        return withdrawalPostMapper.findByIdAndAuthorId(id, authorId);
    }

    @Transactional
    public WithdrawalResponse create(WithdrawalCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("privateNum", 0);

        withdrawalPostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        withdrawalPostMapper.updatePrivateNum(id, id);
        WithdrawalResponse created = withdrawalPostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return withdrawalCommentMapper.findByPrivateNum(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        WithdrawalResponse post = withdrawalPostMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName() != null ? request.getAuthorName() : "익명");
        params.put("content", request.getContent());
        params.put("privateNum", postId);
        params.put("confirm", "N");

        withdrawalCommentMapper.insert(params);
        Integer commentId = (Integer) params.get("id");

        int count = withdrawalCommentMapper.countByPrivateNum(postId);
        withdrawalPostMapper.updateCommentCount(postId, count);

        return withdrawalCommentMapper.findById(commentId);
    }
}

package com.chodae.service;

import com.chodae.dto.FreeBoardCreateRequest;
import com.chodae.dto.FreeBoardResponse;
import com.chodae.dto.FreeBoardCommentResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.mapper.FreeBoardCommentMapper;
import com.chodae.mapper.FreeBoardPostMapper;
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
public class FreeBoardService {

    private final FreeBoardPostMapper freeBoardPostMapper;
    private final FreeBoardCommentMapper freeBoardCommentMapper;

    public List<FreeBoardResponse> findAll() {
        return freeBoardPostMapper.findAll();
    }

    public FreeBoardResponse findById(Integer id) {
        return freeBoardPostMapper.findById(id);
    }

    public FreeBoardResponse findByIdAndAuthorId(Integer id, String authorId) {
        return freeBoardPostMapper.findByIdAndAuthorId(id, authorId);
    }

    @Transactional
    public FreeBoardResponse create(FreeBoardCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("privateNum", 0);

        freeBoardPostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        freeBoardPostMapper.updatePrivateNum(id, id);
        FreeBoardResponse created = freeBoardPostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<FreeBoardCommentResponse> findCommentsByPostId(Integer postId) {
        return freeBoardCommentMapper.findByPrivateNum(postId);
    }

    @Transactional
    public FreeBoardCommentResponse addComment(Integer postId, CommentCreateRequest request) {
        FreeBoardResponse post = freeBoardPostMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName() != null ? request.getAuthorName() : "익명");
        params.put("content", request.getContent());
        params.put("privateNum", postId);
        params.put("confirm", "N");

        freeBoardCommentMapper.insert(params);
        Integer commentId = (Integer) params.get("id");

        int count = freeBoardCommentMapper.countByPrivateNum(postId);
        freeBoardPostMapper.updateCommentCount(postId, count);

        return freeBoardCommentMapper.findById(commentId);
    }
}

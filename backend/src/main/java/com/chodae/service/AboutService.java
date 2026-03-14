package com.chodae.service;

import com.chodae.dto.AboutCreateRequest;
import com.chodae.dto.AboutResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.mapper.AboutCommentMapper;
import com.chodae.mapper.AboutPostMapper;
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
public class AboutService {

    private final AboutPostMapper aboutPostMapper;
    private final AboutCommentMapper aboutCommentMapper;

    public List<AboutResponse> findAll() {
        return aboutPostMapper.findAll();
    }

    public List<AboutResponse> findByAuthorId(String authorId) {
        return aboutPostMapper.findByAuthorId(authorId);
    }

    public AboutResponse findById(Integer id) {
        return aboutPostMapper.findById(id);
    }

    public AboutResponse findByIdAndAuthorId(Integer id, String authorId) {
        return aboutPostMapper.findByIdAndAuthorId(id, authorId);
    }

    @Transactional
    public AboutResponse create(AboutCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("privateNum", 0);

        aboutPostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        aboutPostMapper.updatePrivateNum(id, id);
        AboutResponse created = aboutPostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return aboutCommentMapper.findByPrivateNum(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        AboutResponse post = aboutPostMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName() != null ? request.getAuthorName() : "익명");
        params.put("content", request.getContent());
        params.put("privateNum", postId);
        params.put("confirm", "N");

        aboutCommentMapper.insert(params);
        Integer commentId = (Integer) params.get("id");

        int count = aboutCommentMapper.countByPrivateNum(postId);
        aboutPostMapper.updateCommentCount(postId, count);

        return aboutCommentMapper.findById(commentId);
    }
}

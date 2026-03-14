package com.chodae.service;

import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.DoctrineCreateRequest;
import com.chodae.dto.DoctrineResponse;
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

    public List<DoctrineResponse> findAll() {
        return doctrinePostMapper.findAll();
    }

    public DoctrineResponse findById(Integer id) {
        return doctrinePostMapper.findById(id);
    }

    public DoctrineResponse findByIdAndAuthorId(Integer id, String authorId) {
        return doctrinePostMapper.findByIdAndAuthorId(id, authorId);
    }

    @Transactional
    public DoctrineResponse create(DoctrineCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("privateNum", 0);

        doctrinePostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        doctrinePostMapper.updatePrivateNum(id, id);
        DoctrineResponse created = doctrinePostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return doctrineCommentMapper.findByPrivateNum(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        DoctrineResponse post = doctrinePostMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName() != null ? request.getAuthorName() : "익명");
        params.put("content", request.getContent());
        params.put("privateNum", postId);
        params.put("confirm", "N");

        doctrineCommentMapper.insert(params);
        Integer commentId = (Integer) params.get("id");

        int count = doctrineCommentMapper.countByPrivateNum(postId);
        doctrinePostMapper.updateCommentCount(postId, count);

        return doctrineCommentMapper.findById(commentId);
    }
}

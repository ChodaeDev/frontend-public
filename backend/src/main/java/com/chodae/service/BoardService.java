package com.chodae.service;

import com.chodae.dto.BoardCreateRequest;
import com.chodae.dto.BoardResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.mapper.BoardCommentMapper;
import com.chodae.mapper.BoardPostMapper;
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
public class BoardService {

    private final BoardPostMapper boardPostMapper;
    private final BoardCommentMapper boardCommentMapper;

    public List<BoardResponse> findAll() {
        return boardPostMapper.findAll();
    }

    public BoardResponse findById(Integer id) {
        return boardPostMapper.findById(id);
    }

    public BoardResponse findByIdAndAuthorId(Integer id, String authorId) {
        return boardPostMapper.findByIdAndAuthorId(id, authorId);
    }

    @Transactional
    public BoardResponse create(BoardCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", request.getTitle());
        params.put("content", request.getContent());
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName());
        params.put("phone", request.getPhone());
        params.put("counselType", request.getCounselType());
        params.put("privateNum", 0);

        boardPostMapper.insert(params);
        Object idObj = params.get("id");
        Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : null;
        if (id == null) {
            throw new IllegalStateException("글 등록 후 ID를 가져오지 못했습니다.");
        }
        boardPostMapper.updatePrivateNum(id, id);
        BoardResponse created = boardPostMapper.findById(id);
        if (created == null) {
            throw new IllegalStateException("등록된 글을 조회할 수 없습니다.");
        }
        return created;
    }

    public List<CommentResponse> findCommentsByPostId(Integer postId) {
        return boardCommentMapper.findByPrivateNum(postId);
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CommentCreateRequest request) {
        BoardResponse post = boardPostMapper.findById(postId);
        if (post == null) {
            throw new IllegalArgumentException("글이 존재하지 않습니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("authorId", request.getAuthorId());
        params.put("authorName", request.getAuthorName() != null ? request.getAuthorName() : "익명");
        params.put("content", request.getContent());
        params.put("privateNum", postId);
        params.put("confirm", "N");

        boardCommentMapper.insert(params);
        Integer commentId = (Integer) params.get("id");

        int count = boardCommentMapper.countByPrivateNum(postId);
        boardPostMapper.updateCommentCount(postId, count);

        return boardCommentMapper.findById(commentId);
    }
}

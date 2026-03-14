package com.chodae.controller;

import com.chodae.dto.ApiResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.PreventionCreateRequest;
import com.chodae.dto.PreventionResponse;
import com.chodae.service.PreventionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/prevention/resources")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ResourcesController {

    private final PreventionService preventionService;

    private String getCurrentUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            return null;
        }
        return (String) auth.getPrincipal();
    }

    @GetMapping("/list")
    public ApiResponse<List<PreventionResponse>> getList(Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        List<PreventionResponse> list = preventionService.findAll();
        return ApiResponse.success(list);
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<PreventionResponse> getDetail(@PathVariable Integer id, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        PreventionResponse post = preventionService.findByIdAndAuthorId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        return ApiResponse.success(post);
    }

    @GetMapping("/detail/{id}/comments")
    public ApiResponse<List<CommentResponse>> getComments(@PathVariable Integer id, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        PreventionResponse post = preventionService.findByIdAndAuthorId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        return ApiResponse.success(preventionService.findCommentsByPostId(id));
    }

    @PostMapping("/form")
    public ApiResponse<PreventionResponse> create(@RequestBody PreventionCreateRequest request, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return ApiResponse.error("제목을 입력해주세요.");
        }
        if (request.getAuthorName() == null || request.getAuthorName().isBlank()) {
            return ApiResponse.error("작성자 이름을 입력해주세요.");
        }
        request.setAuthorId(userId);
        PreventionResponse created = preventionService.create(request);
        return ApiResponse.success("상담 신청이 완료되었습니다.", created);
    }

    @PostMapping("/detail/{id}/comments")
    public ApiResponse<CommentResponse> addComment(@PathVariable Integer id, @RequestBody CommentCreateRequest request, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        PreventionResponse post = preventionService.findByIdAndAuthorId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            return ApiResponse.error("댓글 내용을 입력해주세요.");
        }
        request.setAuthorId(userId);
        request.setAuthorName(request.getAuthorName() != null ? request.getAuthorName() : "익명");
        CommentResponse comment = preventionService.addComment(id, request);
        return ApiResponse.success("댓글이 등록되었습니다.", comment);
    }
}

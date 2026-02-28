package com.chodae.controller;

import com.chodae.dto.ApiResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.PrivateCounselingCreateRequest;
import com.chodae.dto.PrivateCounselingResponse;
import com.chodae.service.PrivateCounselingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/public/counseling")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PrivateCounselingController {

    private final PrivateCounselingService privateCounselingService;

    @GetMapping("/list")
    public ApiResponse<List<PrivateCounselingResponse>> getList() {
        List<PrivateCounselingResponse> list = privateCounselingService.findAll();
        return ApiResponse.success(list);
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<PrivateCounselingResponse> getDetail(@PathVariable Integer id) {
        PrivateCounselingResponse post = privateCounselingService.findById(id);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않습니다.");
        }
        return ApiResponse.success(post);
    }

    @GetMapping("/detail/{id}/comments")
    public ApiResponse<List<CommentResponse>> getComments(@PathVariable Integer id) {
        List<CommentResponse> comments = privateCounselingService.findCommentsByPostId(id);
        return ApiResponse.success(comments);
    }

    @PostMapping("/form")
    public ApiResponse<PrivateCounselingResponse> create(@RequestBody PrivateCounselingCreateRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return ApiResponse.error("제목을 입력해주세요.");
        }
        if (request.getAuthorName() == null || request.getAuthorName().isBlank()) {
            return ApiResponse.error("작성자 이름을 입력해주세요.");
        }
        PrivateCounselingResponse created = privateCounselingService.create(request);
        return ApiResponse.success("상담 신청이 완료되었습니다.", created);
    }

    @PostMapping("/detail/{id}/comments")
    public ApiResponse<CommentResponse> addComment(@PathVariable Integer id, @RequestBody CommentCreateRequest request) {
        if (request.getContent() == null || request.getContent().isBlank()) {
            return ApiResponse.error("댓글 내용을 입력해주세요.");
        }
        CommentResponse comment = privateCounselingService.addComment(id, request);
        return ApiResponse.success("댓글이 등록되었습니다.", comment);
    }
}

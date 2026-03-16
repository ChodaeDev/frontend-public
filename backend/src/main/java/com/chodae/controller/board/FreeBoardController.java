package com.chodae.controller;

import com.chodae.dto.ApiResponse;
import com.chodae.dto.FreeBoardCreateRequest;
import com.chodae.dto.FreeBoardResponse;
import com.chodae.dto.PagedListResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.FreeBoardCommentResponse;
import com.chodae.service.FreeBoardService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "자유게시판", description = "자유게시판 페이지 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/freeboard")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FreeBoardController {

    private final FreeBoardService freeBoardService;

    private String getCurrentUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            return null;
        }
        return (String) auth.getPrincipal();
    }

    @GetMapping("/list")
    public ApiResponse<PagedListResponse<FreeBoardResponse>> getList(
            @Parameter(description = "현재 페이지")
            @RequestParam(defaultValue = "1") int pageNumber,
            @Parameter(description = "한 페이징에서 표출할 데이터 개수")
            @RequestParam(defaultValue = "10") int itemCount,
            @Parameter(description = "페이지네이션에 넣을 숫자 개수")
            @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "정렬 기준")
            @RequestParam(required = false) String sorting,
            Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        // 모든 로그인 사용자가 목록 조회 가능 (내용은 작성자만 상세에서 볼 수 있음)
        PagedListResponse<FreeBoardResponse> list = freeBoardService.findAllWithPaging(pageNumber, itemCount, pageSize, sorting);
        return ApiResponse.success(list);
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<FreeBoardResponse> getDetail(@PathVariable Integer id, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        FreeBoardResponse post = freeBoardService.findByIdAndAuthorId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        return ApiResponse.success(post);
    }

    @GetMapping("/detail/{id}/comments")
    public ApiResponse<List<FreeBoardCommentResponse>> getComments(@PathVariable Integer id, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        FreeBoardResponse post = freeBoardService.findByIdAndAuthorId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        return ApiResponse.success(freeBoardService.findCommentsByPostId(id));
    }

    @PostMapping("/form")
    public ApiResponse<FreeBoardResponse> create(@RequestBody FreeBoardCreateRequest request, Authentication auth) {
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
        FreeBoardResponse created = freeBoardService.create(request);
        return ApiResponse.success("상담 신청이 완료되었습니다.", created);
    }

    @PostMapping("/detail/{id}/comments")
    public ApiResponse<FreeBoardCommentResponse> addComment(@PathVariable Integer id, @RequestBody CommentCreateRequest request, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        FreeBoardResponse post = freeBoardService.findByIdAndAuthorId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            return ApiResponse.error("댓글 내용을 입력해주세요.");
        }
        request.setAuthorId(userId);
        request.setAuthorName(request.getAuthorName() != null ? request.getAuthorName() : "익명");
        FreeBoardCommentResponse comment = freeBoardService.addComment(id, request);
        return ApiResponse.success("댓글이 등록되었습니다.", comment);
    }
}

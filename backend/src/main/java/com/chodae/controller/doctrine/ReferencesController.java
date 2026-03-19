package com.chodae.controller.doctrine;

import com.chodae.dto.ApiResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.PagedListResponse;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.DoctrineCreateRequest;
import com.chodae.dto.DoctrineResponse;
import com.chodae.service.DoctrineService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "신천지 실체 참고 자료", description = "신천지 실체 참고 자료 페이지 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/doctrine/references")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ReferencesController {

    private final DoctrineService doctrineService;

    private String getCurrentUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            return null;
        }
        return (String) auth.getPrincipal();
    }

    @GetMapping("/list")
    public ApiResponse<PagedListResponse<DoctrineResponse>> getList(
            @Parameter(description = "현재 페이지")
            @RequestParam(defaultValue = "1") int pageNumber,
            @Parameter(description = "한 페이징에서 표출할 데이터 개수")
            @RequestParam(defaultValue = "10") int itemCount,
            @Parameter(description = "페이지네이션에 넣을 숫자 개수")
            @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "정렬 기준")
            @RequestParam(required = false) String sorting) {
        PagedListResponse<DoctrineResponse> list = doctrineService.findAllWithPaging(pageNumber, itemCount, pageSize, sorting);
        return ApiResponse.success(list);
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<DoctrineResponse> getDetail(@PathVariable Integer id, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        DoctrineResponse post = doctrineService.findByIdAndUserId(id, userId);
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
        DoctrineResponse post = doctrineService.findByIdAndUserId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        return ApiResponse.success(doctrineService.findCommentsByPostId(id));
    }

    @PostMapping("/form")
    public ApiResponse<DoctrineResponse> create(@RequestBody DoctrineCreateRequest request, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return ApiResponse.error("제목을 입력해주세요.");
        }
        if (request.getUserName() == null || request.getUserName().isBlank()) {
            return ApiResponse.error("작성자 이름을 입력해주세요.");
        }
        request.setUserId(userId);
        DoctrineResponse created = doctrineService.create(request);
        return ApiResponse.success("상담 신청이 완료되었습니다.", created);
    }

    @PostMapping("/detail/{id}/comments")
    public ApiResponse<CommentResponse> addComment(@PathVariable Integer id, @RequestBody CommentCreateRequest request, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        DoctrineResponse post = doctrineService.findByIdAndUserId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            return ApiResponse.error("댓글 내용을 입력해주세요.");
        }
        request.setUserId(userId);
        request.setUserName(request.getUserName() != null ? request.getUserName() : "익명");
        CommentResponse comment = doctrineService.addComment(id, request);
        return ApiResponse.success("댓글이 등록되었습니다.", comment);
    }
}

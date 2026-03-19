package com.chodae.controller.withdrawal;

import com.chodae.dto.ApiResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.PagedListResponse;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.WithdrawalCreateRequest;
import com.chodae.dto.WithdrawalResponse;
import com.chodae.service.WithdrawalService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "지혜로운 탈퇴방법", description = "지혜로운 탈퇴방법 페이지 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/withdrawal/methods")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MethodsController {

    private final WithdrawalService withdrawalService;

    private String getCurrentUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            return null;
        }
        return (String) auth.getPrincipal();
    }

    @GetMapping("/list")
    public ApiResponse<PagedListResponse<WithdrawalResponse>> getList(
            @Parameter(description = "현재 페이지")
            @RequestParam(defaultValue = "1") int pageNumber,
            @Parameter(description = "한 페이징에서 표출할 데이터 개수")
            @RequestParam(defaultValue = "10") int itemCount,
            @Parameter(description = "페이지네이션에 넣을 숫자 개수")
            @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "정렬 기준")
            @RequestParam(required = false) String sorting) {
        PagedListResponse<WithdrawalResponse> list = withdrawalService.findAllWithPaging(pageNumber, itemCount, pageSize, sorting);
        return ApiResponse.success(list);
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<WithdrawalResponse> getDetail(@PathVariable Integer id, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        WithdrawalResponse post = withdrawalService.findByIdAndUserId(id, userId);
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
        WithdrawalResponse post = withdrawalService.findByIdAndUserId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        return ApiResponse.success(withdrawalService.findCommentsByPostId(id));
    }

    @PostMapping("/form")
    public ApiResponse<WithdrawalResponse> create(@RequestBody WithdrawalCreateRequest request, Authentication auth) {
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
        WithdrawalResponse created = withdrawalService.create(request);
        return ApiResponse.success("상담 신청이 완료되었습니다.", created);
    }

    @PostMapping("/detail/{id}/comments")
    public ApiResponse<CommentResponse> addComment(@PathVariable Integer id, @RequestBody CommentCreateRequest request, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        WithdrawalResponse post = withdrawalService.findByIdAndUserId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            return ApiResponse.error("댓글 내용을 입력해주세요.");
        }
        request.setUserId(userId);
        request.setUserName(request.getUserName() != null ? request.getUserName() : "익명");
        CommentResponse comment = withdrawalService.addComment(id, request);
        return ApiResponse.success("댓글이 등록되었습니다.", comment);
    }
}

package com.chodae.controller.about;

import com.chodae.dto.AboutCreateRequest;
import com.chodae.dto.AboutResponse;
import com.chodae.dto.ApiResponse;
import com.chodae.dto.PagedListResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentResponse;
import com.chodae.service.AboutService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "인터뷰 및 언론보도", description = "인터뷰 및 언론보도 페이지 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/about/interviews")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class InterviewsController {

    private final AboutService aboutService;

    private String getCurrentUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            return null;
        }
        return (String) auth.getPrincipal();
    }

    @GetMapping("/list")
    public ApiResponse<PagedListResponse<AboutResponse>> getList(
            @Parameter(description = "현재 페이지")
            @RequestParam(defaultValue = "1") int pageNumber,
            @Parameter(description = "한 페이징에서 표출할 데이터 개수")
            @RequestParam(defaultValue = "10") int itemCount,
            @Parameter(description = "페이지네이션에 넣을 숫자 개수")
            @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "정렬 기준")
            @RequestParam(required = false) String sorting) {
        PagedListResponse<AboutResponse> list = aboutService.findAllWithPaging(pageNumber, itemCount, pageSize, sorting);
        return ApiResponse.success(list);
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<AboutResponse> getDetail(@PathVariable Integer id, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        AboutResponse post = aboutService.findByIdAndUserId(id, userId);
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
        AboutResponse post = aboutService.findByIdAndUserId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        return ApiResponse.success(aboutService.findCommentsByPostId(id));
    }

    @PostMapping("/form")
    public ApiResponse<AboutResponse> create(@RequestBody AboutCreateRequest request, Authentication auth) {
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
        AboutResponse created = aboutService.create(request);
        return ApiResponse.success("상담 신청이 완료되었습니다.", created);
    }

    @PostMapping("/detail/{id}/comments")
    public ApiResponse<CommentResponse> addComment(@PathVariable Integer id, @RequestBody CommentCreateRequest request, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        AboutResponse post = aboutService.findByIdAndUserId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            return ApiResponse.error("댓글 내용을 입력해주세요.");
        }
        request.setUserId(userId);
        request.setUserName(request.getUserName() != null ? request.getUserName() : "익명");
        CommentResponse comment = aboutService.addComment(id, request);
        return ApiResponse.success("댓글이 등록되었습니다.", comment);
    }
}

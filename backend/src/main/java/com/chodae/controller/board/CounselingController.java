package com.chodae.controller.board;

import com.chodae.dto.ApiResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentDeleteResponse;
import com.chodae.dto.CounselingDeleteResponse;
import com.chodae.dto.PagedApiResponse;
import com.chodae.dto.PagedListResponse;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.CounselingCreateRequest;
import com.chodae.dto.CounselingResponse;
import com.chodae.service.CounselingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Tag(name = "상담게시판", description = "상담게시판 페이지 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/board/counseling")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CounselingController {

    private final CounselingService counselingService;

    private String getCurrentUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            return null;
        }
        return (String) auth.getPrincipal();
    }

    @GetMapping("/list")
    public PagedApiResponse<CounselingResponse> getList(
            HttpServletRequest request,
            @Parameter(description = "현재 페이지")
            @RequestParam(defaultValue = "1") int pageNumber,
            @Parameter(description = "한 페이징에서 표출할 데이터 개수")
            @RequestParam(defaultValue = "10") int itemCount,
            @Parameter(description = "페이지네이션에 넣을 숫자 개수")
            @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "정렬 기준")
            @RequestParam(required = false) String sorting) {
        PagedListResponse<CounselingResponse> list = counselingService.findAllWithPaging(pageNumber, itemCount, pageSize, sorting);
        return PagedApiResponse.of(HttpStatus.OK.value(), request.getRequestURI(), list);
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<CounselingResponse> getDetail(@PathVariable Integer id, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        CounselingResponse post = counselingService.findByIdAndUserId(id, userId);
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
        CounselingResponse post = counselingService.findByIdAndUserId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        return ApiResponse.success(counselingService.findCommentsByPostId(id));
    }

    @PostMapping("/form")
    public ApiResponse<CounselingResponse> create(@RequestBody CounselingCreateRequest request, Authentication auth) {
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
        CounselingResponse created = counselingService.create(request);
        return ApiResponse.success("상담 신청이 완료되었습니다.", created);
    }

    @PostMapping("/edit/{id}")
    public ApiResponse<CounselingResponse> edit(@PathVariable Integer id, @RequestBody CounselingCreateRequest request,
            Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        CounselingResponse post = counselingService.findByIdAndUserId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return ApiResponse.error("제목을 입력해주세요.");
        }
        if (request.getUserName() == null || request.getUserName().isBlank()) {
            return ApiResponse.error("작성자 이름을 입력해주세요.");
        }
        request.setUserId(userId);
        CounselingResponse edited = counselingService.edit(id, request);
        return ApiResponse.success("상담 신청 내용이 수정되었습니다.", edited);
    }
    
    @Operation(summary = "상담 글 삭제", description = "로그인한 작성자 본인의 상담 글을 삭제합니다. 연관 댓글도 함께 삭제됩니다.")
    @DeleteMapping("/delete/{id}")
    public ApiResponse<CounselingDeleteResponse> deletePost(
            @Parameter(description = "상담 글 ID") @PathVariable Integer postId,
            Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
        return ApiResponse.error("로그인이 필요합니다.");
        }
        try {
            CounselingDeleteResponse result = counselingService.deletePostById(postId);
            return ApiResponse.success("상담 글이 삭제되었습니다.", result);
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        } catch (IllegalStateException e) {
            log.error("상담 글 삭제 실패 - id: {}, userId: {}, {}", postId, "test", e.getMessage());
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/detail/{id}/comments")
    public ApiResponse<CommentResponse> addComment(@PathVariable Integer id, @RequestBody CommentCreateRequest request,
            Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        CounselingResponse post = counselingService.findById(id);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            return ApiResponse.error("댓글 내용을 입력해주세요.");
        }
        request.setUserId(userId);
        request.setUserName(request.getUserName() != null ? request.getUserName() : "익명");
        CommentResponse comment = counselingService.addComment(id, request);
        return ApiResponse.success("댓글이 등록되었습니다.", comment);
    }

    @Operation(summary = "댓글 수정", description = "로그인한 작성자 본인의 댓글을 수정합니다.")
    @PutMapping("/detail/{postId}/comments/{commentId}")
    public ApiResponse<CommentResponse> updateComment(
            @Parameter(description = "상담 글 ID") @PathVariable Integer postId,
            @Parameter(description = "댓글 ID") @PathVariable Integer commentId,
            @RequestBody CommentCreateRequest request,
            Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            return ApiResponse.error("댓글 내용을 입력해주세요.");
        }

        request.setUserId(userId);
        try {
            CommentResponse updated = counselingService.updateComment(postId, commentId, request);
            return ApiResponse.success("댓글이 수정되었습니다.", updated);
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        } catch (IllegalStateException e) {
            log.error("상담 댓글 수정 실패 - postId: {}, commentId: {}, userId: {}, error: {}", postId, commentId, userId, e.getMessage());
            return ApiResponse.error(e.getMessage());
        }
    }

    @Operation(summary = "댓글 삭제", description = "로그인한 작성자 본인의 댓글을 삭제합니다.")
    @DeleteMapping("/detail/{postId}/comments/{commentId}")
    public ApiResponse<CommentDeleteResponse> deleteComment(
            @Parameter(description = "상담 글 ID") @PathVariable Integer postId,
            @Parameter(description = "댓글 ID") @PathVariable Integer commentId,
            Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            CommentDeleteResponse result = counselingService.deleteComment(postId, commentId, userId);
            return ApiResponse.success("댓글이 삭제되었습니다.", result);
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        } catch (IllegalStateException e) {
            log.error("상담 댓글 삭제 실패 - postId: {}, commentId: {}, userId: {}, error: {}", postId, commentId, userId, e.getMessage());
            return ApiResponse.error(e.getMessage());
        }
    }
}

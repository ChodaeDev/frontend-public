package com.chodae.controller.prevention;

import com.chodae.dto.ApiResponse;
import com.chodae.dto.CommentCreateRequest;
import com.chodae.dto.CommentDeleteResponse;
import com.chodae.dto.CounselingDeleteResponse;
import com.chodae.dto.PagedListResponse;
import com.chodae.dto.CommentResponse;
import com.chodae.dto.PreventionCreateRequest;
import com.chodae.dto.PreventionResponse;
import com.chodae.service.PreventionService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "예방 자료", description = "예방 자료 페이지 관련 API")
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
    public ApiResponse<PagedListResponse<PreventionResponse>> getList(
            @Parameter(description = "현재 페이지")
            @RequestParam(defaultValue = "1") int pageNumber,
            @Parameter(description = "한 페이징에서 표출할 데이터 개수")
            @RequestParam(defaultValue = "10") int itemCount,
            @Parameter(description = "페이지네이션에 넣을 숫자 개수")
            @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "정렬 기준")
            @RequestParam(required = false) String sorting) {
        PagedListResponse<PreventionResponse> list = preventionService.findAllWithPaging("resources", pageNumber, itemCount, pageSize, sorting);
        return ApiResponse.success(list);
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<PreventionResponse> getDetail(@PathVariable Integer id, Authentication auth) {
        PreventionResponse post = preventionService.findByIdForBoard("resources", id);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        return ApiResponse.success(post);
    }

    @GetMapping("/detail/{id}/comments")
    public ApiResponse<List<CommentResponse>> getComments(@PathVariable Integer id, Authentication auth) {
        PreventionResponse post = preventionService.findByIdForBoard("resources", id);
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
        if (request.getUserName() == null || request.getUserName().isBlank()) {
            return ApiResponse.error("작성자 이름을 입력해주세요.");
        }
        request.setUserId(userId);
        request.setSubMenu("resources");
        PreventionResponse created = preventionService.create(request);
        return ApiResponse.success("상담 신청이 완료되었습니다.", created);
    }

    @PostMapping("/detail/{id}/comments")
    public ApiResponse<CommentResponse> addComment(@PathVariable Integer id, @RequestBody CommentCreateRequest request, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        PreventionResponse post = preventionService.findByIdAndUserId(id, userId);
        if (post == null) {
            return ApiResponse.error("글이 존재하지 않거나 접근 권한이 없습니다.");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            return ApiResponse.error("댓글 내용을 입력해주세요.");
        }
        request.setUserId(userId);
        request.setSubMenu("resources");
        request.setUserName(request.getUserName() != null ? request.getUserName() : "익명");
        CommentResponse comment = preventionService.addComment(id, request);
        return ApiResponse.success("댓글이 등록되었습니다.", comment);
    }

    @PutMapping("/edit/{id}")
    public ApiResponse<PreventionResponse> edit(@PathVariable Integer id, @RequestBody PreventionCreateRequest request, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) return ApiResponse.error("로그인이 필요합니다.");
        if (request.getTitle() == null || request.getTitle().isBlank()) return ApiResponse.error("제목을 입력해주세요.");
        request.setUserId(userId);
        request.setSubMenu("resources");
        return ApiResponse.success("글이 수정되었습니다.", preventionService.edit("resources", id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<CounselingDeleteResponse> deletePost(@PathVariable Integer id, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) return ApiResponse.error("로그인이 필요합니다.");
        return ApiResponse.success("글이 삭제되었습니다.", preventionService.deletePostById("resources", id, userId));
    }

    @PutMapping("/detail/{postId}/comments/{commentId}")
    public ApiResponse<CommentResponse> updateComment(@PathVariable Integer postId, @PathVariable Integer commentId,
            @RequestBody CommentCreateRequest request, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) return ApiResponse.error("로그인이 필요합니다.");
        if (request.getContent() == null || request.getContent().isBlank()) return ApiResponse.error("댓글 내용을 입력해주세요.");
        request.setUserId(userId);
        request.setSubMenu("resources");
        return ApiResponse.success("댓글이 수정되었습니다.", preventionService.updateComment("resources", postId, commentId, request));
    }

    @DeleteMapping("/detail/{postId}/comments/{commentId}")
    public ApiResponse<CommentDeleteResponse> deleteComment(@PathVariable Integer postId, @PathVariable Integer commentId, Authentication auth) {
        String userId = getCurrentUserId(auth);
        if (userId == null) return ApiResponse.error("로그인이 필요합니다.");
        return ApiResponse.success("댓글이 삭제되었습니다.", preventionService.deleteComment("resources", postId, commentId, userId));
    }
}

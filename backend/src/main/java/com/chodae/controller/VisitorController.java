package com.chodae.controller;

import com.chodae.dto.ApiResponse;
import com.chodae.service.VisitorCountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Tag(name = "방문자 정보", description = "방문자 정보 수집 및 표시 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/public/visitor")
@CrossOrigin(origins = "*")
public class VisitorController {

    @Autowired
    private VisitorCountService visitorCountService;

    @Operation(summary = "방문 기록", description = "접속 시 호출. sessionId 없으면 서버에서 생성하여 반환")
    @PostMapping("/increment")
    public ApiResponse<Map<String, String>> incrementVisitorCount(
            HttpServletRequest request,
            @RequestBody(required = false) Map<String, String> body) {

        String sessionId = body != null ? body.get("sessionId") : null;
        if (sessionId == null || sessionId.isBlank()) {
            sessionId = UUID.randomUUID().toString();
        }

        visitorCountService.recordVisit(request, sessionId);

        return ApiResponse.success("접속이 기록되었습니다.", Map.of("sessionId", sessionId));
    }

    @Operation(summary = "오늘 접속자 수")
    @GetMapping("/count")
    public ApiResponse<Map<String, Object>> getTodayVisitorCount() {
        Map<String, Object> visitorCount = visitorCountService.getTodayVisitorDetail();
        return ApiResponse.success("오늘 접속자 수를 조회했습니다.", visitorCount);
    }

    @Operation(summary = "접속 통계", description = "현재 접속자 수, 오늘 누계, 국가/지역별 통계")
    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> getVisitorStats() {
        Map<String, Object> stats = visitorCountService.getVisitorStats();
        return ApiResponse.success("접속 통계를 조회했습니다.", stats);
    }
}

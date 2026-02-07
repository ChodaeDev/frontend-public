package com.chodae.controller;

import com.chodae.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class TestController {

    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> healthCheck() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("service", "Chodae Recovery API");
        healthInfo.put("version", "1.0.0");
        healthInfo.put("timestamp", System.currentTimeMillis());

        return ApiResponse.success("서비스가 정상적으로 실행 중입니다.", healthInfo);
    }

    @GetMapping("/test")
    public ApiResponse<String> test() {
        return ApiResponse.success("API 테스트 성공!");
    }
}

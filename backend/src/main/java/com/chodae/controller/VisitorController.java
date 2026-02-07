package com.chodae.controller;

import com.chodae.dto.ApiResponse;
import com.chodae.service.VisitorCountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/visitor")
@CrossOrigin(origins = "*")
public class VisitorController {
    
    @Autowired
    private VisitorCountService visitorCountService;
    
    @PostMapping("/increment")
    public ApiResponse<String> incrementVisitorCount() {
        visitorCountService.incrementTodayVisitorCount();
        return ApiResponse.success("접속자 수가 증가되었습니다.");
    }
    
    @GetMapping("/count")
    public ApiResponse<Map<String, Object>> getTodayVisitorCount() {
        Map<String, Object> visitorCount = visitorCountService.getTodayVisitorCount();
        return ApiResponse.success("오늘 접속자 수를 조회했습니다.", visitorCount);
    }
}

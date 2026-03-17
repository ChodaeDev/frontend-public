package com.chodae.config;

import com.chodae.dto.ApiResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * (선택) ApiResponse 반환 시 모든 응답에 timestamp, status, path 를 붙이고 싶을 때 사용.
 * 현재는 비활성화 상태. 사용하려면 @RestControllerAdvice 주석 해제.
 * 페이징 API는 PagedApiResponse 사용으로 이미 형식이 맞으므로 이 Advice 대상에서 제외할 수 있음.
 */
// @RestControllerAdvice(basePackages = "com.chodae.controller")
public class ApiResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // ApiResponse 타입만 감싸고, PagedApiResponse는 그대로 통과
        Class<?> type = returnType.getParameterType();
        if (type.equals(ResponseEntity.class)) {
            return true;
        }
        return ApiResponse.class.isAssignableFrom(type);
    }

    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {
        if (body == null) {
            return body;
        }

        int status = 200;
        if (body instanceof ResponseEntity<?> res) {
            status = res.getStatusCode().value();
            body = res.getBody();
        }

        String path = null;
        if (request instanceof ServletServerHttpRequest servletRequest) {
            path = servletRequest.getServletRequest().getRequestURI();
        }

        Map<String, Object> wrapper = new LinkedHashMap<>();
        wrapper.put("timestamp", LocalDateTime.now().format(FORMATTER));
        wrapper.put("status", status);
        wrapper.put("path", path);
        wrapper.put("success", body instanceof ApiResponse<?> ar && ar.isSuccess());
        wrapper.put("message", body instanceof ApiResponse<?> ar ? ar.getMessage() : null);
        wrapper.put("data", body instanceof ApiResponse<?> ar ? ar.getData() : body);

        return wrapper;
    }
}

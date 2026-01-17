package com.chodae.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@Order(1)
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String method = httpRequest.getMethod();
        String uri = httpRequest.getRequestURI();
        String queryString = httpRequest.getQueryString();
        String remoteAddr = httpRequest.getRemoteAddr();
        
        log.info("요청 수신 - Method: {}, URI: {}, Query: {}, RemoteAddr: {}", 
            method, uri, queryString != null ? queryString : "", remoteAddr);
        
        long startTime = System.currentTimeMillis();
        
        try {
            chain.doFilter(request, response);
            long duration = System.currentTimeMillis() - startTime;
            log.info("요청 완료 - Method: {}, URI: {}, Status: {}, Duration: {}ms", 
                method, uri, httpResponse.getStatus(), duration);
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("요청 실패 - Method: {}, URI: {}, Duration: {}ms, Error: {}", 
                method, uri, duration, e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        log.info("RequestLoggingFilter 초기화 완료");
    }

    @Override
    public void destroy() {
        log.info("RequestLoggingFilter 종료");
    }
}


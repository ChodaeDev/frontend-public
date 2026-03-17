package com.chodae.util;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 프록시(Nginx 등) 환경에서 클라이언트 실제 IP 추출
 */
public final class ClientIpUtils {

    private static final String[] HEADER_NAMES = {
        "X-Forwarded-For",
        "X-Real-IP",
        "Proxy-Client-IP",
        "WL-Proxy-Client-IP",
        "HTTP_CLIENT_IP",
        "HTTP_X_FORWARDED_FOR"
    };

    private ClientIpUtils() {}

    public static String getClientIp(HttpServletRequest request) {
        for (String header : HEADER_NAMES) {
            String ip = request.getHeader(header);
            if (isValidIp(ip)) {
                // X-Forwarded-For: client, proxy1, proxy2 → 첫 번째가 실제 클라이언트
                if (ip.contains(",")) {
                    ip = ip.split(",")[0].trim();
                }
                return ip;
            }
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "0.0.0.0";
    }

    private static boolean isValidIp(String ip) {
        return ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip);
    }
}

package com.chodae.dto;

/**
 * 사용자 등급 (level)
 * - superadmin: 슈퍼관리자(개발자)
 * - admin: 관리자
 * - general: 일반사용자
 */
public enum UserLevel {
    SUPERADMIN,
    ADMIN,
    GENERAL;

    /** DB/API용 문자열 (소문자) */
    public String toValue() {
        return name().toLowerCase();
    }

    public static UserLevel fromString(String value) {
        if (value == null || value.isBlank()) {
            return GENERAL;
        }
        String v = value.trim().toUpperCase();
        if ("SUPERADMIN".equals(v)) return SUPERADMIN;
        if ("ADMIN".equals(v)) return ADMIN;
        if ("GENERAL".equals(v)) return GENERAL;
        return GENERAL;
    }
}

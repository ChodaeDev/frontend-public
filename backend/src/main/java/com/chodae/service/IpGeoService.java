package com.chodae.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * IP 기반 국가/지역 조회 (ip-api.com 무료 API, 분당 45회 제한)
 * 동일 IP 결과 캐시로 API 호출 최소화
 */
@Slf4j
@Service
public class IpGeoService {

    private static final String API_URL = "http://ip-api.com/json/%s?fields=status,country,regionName,city&lang=ko";
    private static final Duration CACHE_TTL = Duration.ofHours(24);
    private static final int MAX_CACHE_SIZE = 10_000;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<String, CachedGeo> cache = new ConcurrentHashMap<>();

    public GeoResult lookup(String ip) {
        if (ip == null || ip.isEmpty() || "0.0.0.0".equals(ip) || "127.0.0.1".equals(ip)) {
            return GeoResult.unknown();
        }

        CachedGeo cached = cache.get(ip);
        if (cached != null && !cached.isExpired()) {
            return cached.result;
        }

        try {
            String url = String.format(API_URL, ip);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(3))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                log.warn("GeoIP API error for {}: status {}", ip, response.statusCode());
                return GeoResult.unknown();
            }

            JsonNode root = objectMapper.readTree(response.body());
            if ("fail".equals(root.path("status").asText(""))) {
                return GeoResult.unknown();
            }

            String country = root.path("country").asText(null);
            String region = root.path("regionName").asText(null);
            String city = root.path("city").asText(null);

            String regionStr = region;
            if (city != null && !city.isEmpty() && !city.equals(region)) {
                regionStr = (region != null ? region + " " : "") + city;
            } else if (regionStr == null) {
                regionStr = city;
            }

            GeoResult result = new GeoResult(country, regionStr);

            if (cache.size() < MAX_CACHE_SIZE) {
                cache.put(ip, new CachedGeo(result));
            }
            return result;
        } catch (Exception e) {
            log.debug("GeoIP lookup failed for {}: {}", ip, e.getMessage());
            return GeoResult.unknown();
        }
    }

    public record GeoResult(String country, String region) {
        public static GeoResult unknown() {
            return new GeoResult(null, null);
        }
    }

    private static final class CachedGeo {
        final GeoResult result;
        final long createdAt;

        CachedGeo(GeoResult result) {
            this.result = result;
            this.createdAt = System.currentTimeMillis();
        }

        boolean isExpired() {
            return System.currentTimeMillis() - createdAt > CACHE_TTL.toMillis();
        }
    }
}

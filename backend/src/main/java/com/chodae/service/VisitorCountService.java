package com.chodae.service;

import com.chodae.entity.VisitorCount;
import com.chodae.entity.VisitorLog;
import com.chodae.repository.VisitorCountRepository;
import com.chodae.repository.VisitorLogRepository;
import com.chodae.util.ClientIpUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VisitorCountService {

    /** 현재 접속자로 간주하는 기준 (마지막 활동 후 N분 이내) */
    private static final int ACTIVE_MINUTES = 30;

    @Autowired
    private VisitorCountRepository visitorCountRepository;

    @Autowired
    private VisitorLogRepository visitorLogRepository;

    @Autowired
    private IpGeoService ipGeoService;

    @Transactional
    public void recordVisit(HttpServletRequest request, String sessionId) {
        String ip = ClientIpUtils.getClientIp(request);
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime startOfTomorrow = startOfToday.plusDays(1);

        // 1) visitor_log: 날짜별 세션 기록 (같은 세션도 날짜가 바뀌면 신규 방문으로 기록)
        List<VisitorLog> todayLogs = visitorLogRepository.findBySessionIdAndVisitAtBetween(
                sessionId,
                startOfToday,
                startOfTomorrow
        );
        if (!todayLogs.isEmpty()) {
            VisitorLog log = todayLogs.get(0);
            log.updateLastActivity();
            visitorLogRepository.save(log);
        } else {
            IpGeoService.GeoResult geo = ipGeoService.lookup(ip);
            VisitorLog log = new VisitorLog(sessionId, ip, geo.country(), geo.region());
            visitorLogRepository.save(log);
        }

        // 2) visitor_count: 일별 누계 증가 (세션당 하루 1회만 카운트)
        if (todayLogs.isEmpty()) {
            VisitorCount vc = visitorCountRepository.findByVisitDate(today)
                    .orElse(new VisitorCount(today, 0));
            vc.setCount(vc.getCount() + 1);
            visitorCountRepository.save(vc);
        }
    }

    /** 현재 접속자 수 (최근 ACTIVE_MINUTES 분 이내 활동한 세션 수) */
    public long getCurrentVisitorCount() {
        LocalDateTime since = LocalDateTime.now().minusMinutes(ACTIVE_MINUTES);
        return visitorLogRepository.countActiveSessionsSince(since);
    }

    /** 당일 현재 접속자 수 (오늘 날짜 중 최근 ACTIVE_MINUTES 분 이내 활동한 세션 수) */
    public long getTodayCurrentVisitorCount() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime since = now.minusMinutes(ACTIVE_MINUTES);
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime startOfTomorrow = startOfToday.plusDays(1);
        return visitorLogRepository.countActiveSessionsSinceBetween(since, startOfToday, startOfTomorrow);
    }

    /** 오늘 접속자 누계 */
    public long getTodayVisitorCount() {
        LocalDate today = LocalDate.now();
        return visitorCountRepository.findByVisitDate(today)
                .map(VisitorCount::getCount)
                .orElse(0);
    }

    /** 오늘 접속자 누계 (상세: 날짜 포함) */
    public Map<String, Object> getTodayVisitorDetail() {
        LocalDate today = LocalDate.now();
        long count = visitorCountRepository.findByVisitDate(today)
                .map(VisitorCount::getCount)
                .orElse(0);
        Map<String, Object> result = new HashMap<>();
        result.put("date", today.toString());
        result.put("count", count);
        return result;
    }

    /** 국가/지역별 접속 통계 (오늘) */
    public List<Map<String, Object>> getTodayVisitorByRegion() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        List<Object[]> rows = visitorLogRepository.countByCountryRegionBetween(start, end);

        return rows.stream()
                .map(row -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("country", row[0] != null ? row[0].toString() : "알 수 없음");
                    m.put("region", row[1] != null ? row[1].toString() : "");
                    m.put("count", ((Number) row[2]).longValue());
                    return m;
                })
                .collect(Collectors.toList());
    }

    /** 통합 통계 (현재 접속자, 오늘 누계, 지역별) */
    public Map<String, Object> getVisitorStats() {
        Map<String, Object> result = new HashMap<>();
        result.put("currentCount", getTodayCurrentVisitorCount());
        result.put("todayCount", getTodayVisitorCount());
        result.put("todayDate", LocalDate.now().toString());
        result.put("activeMinutes", ACTIVE_MINUTES);
        result.put("byRegion", getTodayVisitorByRegion());
        return result;
    }

    /** 홈/관리 화면에서 쓰기 좋은 당일 실시간 접속 현황 */
    public Map<String, Object> getTodayRealtimeStats() {
        LocalDate today = LocalDate.now();
        Map<String, Object> result = new HashMap<>();
        result.put("date", today.toString());
        result.put("todayCount", getTodayVisitorCount());
        result.put("currentCount", getTodayCurrentVisitorCount());
        result.put("activeMinutes", ACTIVE_MINUTES);
        return result;
    }
}

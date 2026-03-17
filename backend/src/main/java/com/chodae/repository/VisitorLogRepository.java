package com.chodae.repository;

import com.chodae.entity.VisitorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VisitorLogRepository extends JpaRepository<VisitorLog, Long> {

    Optional<VisitorLog> findBySessionId(String sessionId);

    @Query("SELECT COUNT(DISTINCT v.sessionId) FROM VisitorLog v WHERE v.lastActivityAt >= :since")
    long countActiveSessionsSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(v) FROM VisitorLog v WHERE v.visitAt >= :start AND v.visitAt < :end")
    long countByVisitAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query(value = "SELECT country, region, COUNT(*) as cnt FROM visitor_log " +
           "WHERE visit_at >= ?1 AND visit_at < ?2 AND country IS NOT NULL " +
           "GROUP BY country, region ORDER BY cnt DESC", nativeQuery = true)
    List<Object[]> countByCountryRegionBetween(LocalDateTime start, LocalDateTime end);
}

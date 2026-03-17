package com.chodae.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_log", indexes = {
    @Index(name = "idx_session_id", columnList = "session_id"),
    @Index(name = "idx_visit_at", columnList = "visit_at"),
    @Index(name = "idx_last_activity_at", columnList = "last_activity_at"),
    @Index(name = "idx_ip_address", columnList = "ip_address")
})
public class VisitorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false, length = 64)
    private String sessionId;

    @Column(name = "ip_address", nullable = false, length = 45)
    private String ipAddress;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "region", length = 150)
    private String region;

    @Column(name = "visit_at", nullable = false)
    private LocalDateTime visitAt;

    @Column(name = "last_activity_at", nullable = false)
    private LocalDateTime lastActivityAt;

    public VisitorLog() {}

    public VisitorLog(String sessionId, String ipAddress, String country, String region) {
        this.sessionId = sessionId;
        this.ipAddress = ipAddress;
        this.country = country;
        this.region = region;
        LocalDateTime now = LocalDateTime.now();
        this.visitAt = now;
        this.lastActivityAt = now;
    }

    public void updateLastActivity() {
        this.lastActivityAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public LocalDateTime getVisitAt() { return visitAt; }
    public void setVisitAt(LocalDateTime visitAt) { this.visitAt = visitAt; }
    public LocalDateTime getLastActivityAt() { return lastActivityAt; }
    public void setLastActivityAt(LocalDateTime lastActivityAt) { this.lastActivityAt = lastActivityAt; }
}

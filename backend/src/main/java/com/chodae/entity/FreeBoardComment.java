package com.chodae.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "freeboard_comment")
public class FreeBoardComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", length = 100)
    private String userId;

    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "visibility_level", nullable = false)
    private Integer visibilityLevel;

    @Column(length = 20)
    private String confirm;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @PrePersist
    protected void onCreate() {
        createDate = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Integer getVisibilityLevel() { return visibilityLevel; }
    public void setVisibilityLevel(Integer visibilityLevel) { this.visibilityLevel = visibilityLevel; }
    public String getConfirm() { return confirm; }
    public void setConfirm(String confirm) { this.confirm = confirm; }
    public LocalDateTime getCreateDate() { return createDate; }
    public void setCreateDate(LocalDateTime createDate) { this.createDate = createDate; }
}

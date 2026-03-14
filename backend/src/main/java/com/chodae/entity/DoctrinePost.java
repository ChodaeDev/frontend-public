package com.chodae.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctrine_post")
public class DoctrinePost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "author_id", length = 100)
    private String authorId;

    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName;

    @Column(length = 50)
    private String phone;

    @Column(name = "counsel_type", length = 100)
    private String counselType;

    @Column(name = "comment_count", nullable = false)
    private Integer commentCount = 0;

    @Column(name = "private_num", nullable = false)
    private Integer privateNum;

    @Column(name = "reg_dt")
    private LocalDateTime regDt;

    @Column(name = "upd_dt")
    private LocalDateTime updDt;

    @PrePersist
    protected void onCreate() {
        regDt = LocalDateTime.now();
        updDt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updDt = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCounselType() { return counselType; }
    public void setCounselType(String counselType) { this.counselType = counselType; }
    public Integer getCommentCount() { return commentCount; }
    public void setCommentCount(Integer commentCount) { this.commentCount = commentCount; }
    public Integer getPrivateNum() { return privateNum; }
    public void setPrivateNum(Integer privateNum) { this.privateNum = privateNum; }
    public LocalDateTime getRegDt() { return regDt; }
    public void setRegDt(LocalDateTime regDt) { this.regDt = regDt; }
    public LocalDateTime getUpdDt() { return updDt; }
    public void setUpdDt(LocalDateTime updDt) { this.updDt = updDt; }
}

package com.chodae.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "withdrawal_comment")
public class WithdrawalComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "author_id", length = 100)
    private String authorId;

    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "private_num", nullable = false)
    private Integer privateNum;

    @Column(length = 20)
    private String confirm;

    @Column(name = "reg_dt")
    private LocalDateTime regDt;

    @PrePersist
    protected void onCreate() {
        regDt = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Integer getPrivateNum() { return privateNum; }
    public void setPrivateNum(Integer privateNum) { this.privateNum = privateNum; }
    public String getConfirm() { return confirm; }
    public void setConfirm(String confirm) { this.confirm = confirm; }
    public LocalDateTime getRegDt() { return regDt; }
    public void setRegDt(LocalDateTime regDt) { this.regDt = regDt; }
}

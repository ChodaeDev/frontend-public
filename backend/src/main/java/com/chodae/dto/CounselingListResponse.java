package com.chodae.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class CounselingListResponse {
    Integer id;
    String title;
    @JsonIgnore
    String userId;
    String userName;
    Boolean isOwner;
    String counselType;
    Integer commentCount;
    Integer isPrivate;
    LocalDateTime createDate;
    LocalDateTime modifiedDate;
}

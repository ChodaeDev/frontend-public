package com.chodae.mapper;

import com.chodae.dto.CommentResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface WithdrawalCommentMapper {

    List<CommentResponse> findByIsPrivate(@Param("isPrivate") Integer isPrivate);

    CommentResponse findById(@Param("id") Integer id);

    int countByIsPrivate(@Param("isPrivate") Integer isPrivate);

    int insert(Map<String, Object> params);
}

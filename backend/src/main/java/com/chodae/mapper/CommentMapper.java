package com.chodae.mapper;

import com.chodae.dto.CommentResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommentMapper {

    List<CommentResponse> findByIsPrivate(@Param("id") Integer id);

    CommentResponse findById(@Param("id") Integer id);

    int countCommentsByPostId(@Param("postId") Integer postId);

    int insert(Map<String, Object> params);

    int deleteCommentsByPostId(@Param("postId") Integer postId);

    int updateContentByIdAndUserIdAndIsPrivate(@Param("id") Integer id,
            @Param("userId") String userId,
            @Param("isPrivate") Integer isPrivate,
            @Param("content") String content);

    int deleteByIdAndUserId(@Param("id") Integer id,
            @Param("userId") String userId,
            @Param("isPrivate") Integer isPrivate);
}

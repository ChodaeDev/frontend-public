package com.chodae.mapper;

import com.chodae.dto.CommentResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommentMapper {

    List<CommentResponse> findByPostId(@Param("postId") Integer postId);

    CommentResponse findById(@Param("commentId") Integer commentId);

    int countCommentsByPostId(@Param("postId") Integer postId);

    int insert(Map<String, Object> params);

    int deleteCommentsByPostId(@Param("postId") Integer postId);

    int deleteComment(@Param("commentId") Integer commentId,
            @Param("userId") String userId,
            @Param("postId") Integer postId,
            @Param("isAdmin") boolean isAdmin);

    int updateComment(@Param("commentId") Integer commentId,
            @Param("userId") String userId,
            @Param("content") String content,
            @Param("isAdmin") boolean isAdmin);
}

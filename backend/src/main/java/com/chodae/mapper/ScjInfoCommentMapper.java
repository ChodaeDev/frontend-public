package com.chodae.mapper;

import com.chodae.dto.CommentResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ScjInfoCommentMapper {

    List<CommentResponse> findByPrivateNum(@Param("privateNum") Integer privateNum);

    CommentResponse findById(@Param("id") Integer id);

    int countByPrivateNum(@Param("privateNum") Integer privateNum);

    int insert(Map<String, Object> params);
}

package com.chodae.mapper;

import com.chodae.dto.FreeBoardCommentResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface FreeBoardCommentMapper {

    List<FreeBoardCommentResponse> findByIsPrivate(@Param("isPrivate") Integer isPrivate);

    FreeBoardCommentResponse findById(@Param("id") Integer id);

    int countByIsPrivate(@Param("isPrivate") Integer isPrivate);

    int insert(Map<String, Object> params);
}

package com.chodae.mapper;

import com.chodae.dto.FreeBoardCommentResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface FreeBoardCommentMapper {

    List<FreeBoardCommentResponse> findByVisibilityLevel(@Param("visibilityLevel") Integer visibilityLevel);

    FreeBoardCommentResponse findById(@Param("id") Integer id);

    int countByVisibilityLevel(@Param("visibilityLevel") Integer visibilityLevel);

    int insert(Map<String, Object> params);
}

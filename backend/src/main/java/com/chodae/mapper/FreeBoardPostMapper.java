package com.chodae.mapper;

import com.chodae.dto.FreeBoardResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface FreeBoardPostMapper {

    List<FreeBoardResponse> findAll();

    long countAll();

    List<FreeBoardResponse> findAllWithPaging(@Param("offset") int offset, @Param("limit") int limit, @Param("sortColumn") String sortColumn, @Param("sortOrder") String sortOrder);

    List<FreeBoardResponse> findByUserId(@Param("userId") String userId);

    FreeBoardResponse findById(@Param("id") Integer id);

    FreeBoardResponse findByIdAndUserId(@Param("id") Integer id, @Param("userId") String userId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updateVisibilityLevel(@Param("id") Integer id, @Param("visibilityLevel") String visibilityLevel);
}

package com.chodae.mapper;

import com.chodae.dto.DoctrineResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface DoctrinePostMapper {

    List<DoctrineResponse> findAll();

    long countAll(@Param("subMenu") String subMenu);

    List<DoctrineResponse> findAllWithPaging(@Param("subMenu") String subMenu, @Param("offset") int offset, @Param("limit") int limit, @Param("sortColumn") String sortColumn, @Param("sortOrder") String sortOrder);

    List<DoctrineResponse> findByUserId(@Param("userId") String userId);

    DoctrineResponse findById(@Param("id") Integer id);

    DoctrineResponse findByIdAndUserId(@Param("id") Integer id, @Param("userId") String userId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updateVisibilityLevel(@Param("id") Integer id, @Param("visibilityLevel") String visibilityLevel);

    int updateById(@Param("id") Integer id, @Param("params") Map<String, Object> params);

    int deletePostById(@Param("id") Integer id);
}

package com.chodae.mapper;

import com.chodae.dto.AboutResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AboutPostMapper {

    List<AboutResponse> findAll();

    long countAll();

    List<AboutResponse> findAllWithPaging(@Param("offset") int offset, @Param("limit") int limit, @Param("sortColumn") String sortColumn, @Param("sortOrder") String sortOrder);

    List<AboutResponse> findByUserId(@Param("userId") String userId);

    AboutResponse findById(@Param("id") Integer id);

    AboutResponse findByIdAndUserId(@Param("id") Integer id, @Param("userId") String userId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updateIsPrivate(@Param("id") Integer id, @Param("isPrivate") Integer isPrivate);
}

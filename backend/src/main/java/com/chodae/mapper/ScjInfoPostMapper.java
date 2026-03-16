package com.chodae.mapper;

import com.chodae.dto.ScjInfoResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ScjInfoPostMapper {

    List<ScjInfoResponse> findAll();

    long countAll();

    List<ScjInfoResponse> findAllWithPaging(@Param("offset") int offset, @Param("limit") int limit, @Param("sortColumn") String sortColumn, @Param("sortOrder") String sortOrder);

    List<ScjInfoResponse> findByAuthorId(@Param("authorId") String authorId);

    ScjInfoResponse findById(@Param("id") Integer id);

    ScjInfoResponse findByIdAndAuthorId(@Param("id") Integer id, @Param("authorId") String authorId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updatePrivateNum(@Param("id") Integer id, @Param("privateNum") Integer privateNum);
}

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

    List<AboutResponse> findByAuthorId(@Param("authorId") String authorId);

    AboutResponse findById(@Param("id") Integer id);

    AboutResponse findByIdAndAuthorId(@Param("id") Integer id, @Param("authorId") String authorId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updatePrivateNum(@Param("id") Integer id, @Param("privateNum") Integer privateNum);
}

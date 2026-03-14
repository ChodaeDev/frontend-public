package com.chodae.mapper;

import com.chodae.dto.PreventionResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface PreventionPostMapper {

    List<PreventionResponse> findAll();

    List<PreventionResponse> findByAuthorId(@Param("authorId") String authorId);

    PreventionResponse findById(@Param("id") Integer id);

    PreventionResponse findByIdAndAuthorId(@Param("id") Integer id, @Param("authorId") String authorId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updatePrivateNum(@Param("id") Integer id, @Param("privateNum") Integer privateNum);
}

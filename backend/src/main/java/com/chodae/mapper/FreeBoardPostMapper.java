package com.chodae.mapper;

import com.chodae.dto.FreeBoardResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface FreeBoardPostMapper {

    List<FreeBoardResponse> findAll();

    List<FreeBoardResponse> findByAuthorId(@Param("authorId") String authorId);

    FreeBoardResponse findById(@Param("id") Integer id);

    FreeBoardResponse findByIdAndAuthorId(@Param("id") Integer id, @Param("authorId") String authorId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updatePrivateNum(@Param("id") Integer id, @Param("privateNum") Integer privateNum);
}

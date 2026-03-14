package com.chodae.mapper;

import com.chodae.dto.DoctrineResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface DoctrinePostMapper {

    List<DoctrineResponse> findAll();

    List<DoctrineResponse> findByAuthorId(@Param("authorId") String authorId);

    DoctrineResponse findById(@Param("id") Integer id);

    DoctrineResponse findByIdAndAuthorId(@Param("id") Integer id, @Param("authorId") String authorId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updatePrivateNum(@Param("id") Integer id, @Param("privateNum") Integer privateNum);
}

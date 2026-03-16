package com.chodae.mapper;

import com.chodae.dto.FreeBoardCommentResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface FreeBoardCommentMapper {

    List<FreeBoardCommentResponse> findByPrivateNum(@Param("privateNum") Integer privateNum);

    FreeBoardCommentResponse findById(@Param("id") Integer id);

    int countByPrivateNum(@Param("privateNum") Integer privateNum);

    int insert(Map<String, Object> params);
}

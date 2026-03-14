package com.chodae.mapper;

import com.chodae.dto.WithdrawalResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface WithdrawalPostMapper {

    List<WithdrawalResponse> findAll();

    List<WithdrawalResponse> findByAuthorId(@Param("authorId") String authorId);

    WithdrawalResponse findById(@Param("id") Integer id);

    WithdrawalResponse findByIdAndAuthorId(@Param("id") Integer id, @Param("authorId") String authorId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updatePrivateNum(@Param("id") Integer id, @Param("privateNum") Integer privateNum);
}

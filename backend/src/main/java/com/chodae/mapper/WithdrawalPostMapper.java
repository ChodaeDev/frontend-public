package com.chodae.mapper;

import com.chodae.dto.WithdrawalResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface WithdrawalPostMapper {

    List<WithdrawalResponse> findAll();

    long countAll();

    List<WithdrawalResponse> findAllWithPaging(@Param("offset") int offset, @Param("limit") int limit, @Param("sortColumn") String sortColumn, @Param("sortOrder") String sortOrder);

    List<WithdrawalResponse> findByUserId(@Param("userId") String userId);

    WithdrawalResponse findById(@Param("id") Integer id);

    WithdrawalResponse findByIdAndUserId(@Param("id") Integer id, @Param("userId") String userId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updateVisibilityLevel(@Param("id") Integer id, @Param("visibilityLevel") Integer visibilityLevel);
}

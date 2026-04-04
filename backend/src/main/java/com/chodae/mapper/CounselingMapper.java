package com.chodae.mapper;

import com.chodae.dto.CounselingResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CounselingMapper {

    List<CounselingResponse> findAll();

    long countAll();

    List<CounselingResponse> findAllWithPaging(@Param("offset") int offset, @Param("limit") int limit, @Param("sortColumn") String sortColumn, @Param("sortOrder") String sortOrder);

    List<CounselingResponse> findByUserId(@Param("userId") String userId);

    CounselingResponse findById(@Param("postId") Integer postId);

    CounselingResponse findByIdAndUserId(@Param("id") Integer id, @Param("userId") String userId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updateIsPrivate(@Param("id") Integer id, @Param("isPrivate") Boolean isPrivate);

    int deletePostById(@Param("postId") Integer postId);

    int updateById(@Param("id") Integer id, @Param("params") Map<String, Object> params);
}

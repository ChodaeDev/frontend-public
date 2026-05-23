package com.chodae.mapper;

import com.chodae.dto.CounselingListResponse;
import com.chodae.dto.CounselingResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CounselingMapper {

    List<CounselingListResponse> findAll();

    long countAll();

    List<CounselingListResponse> findAllWithPaging(@Param("offset") int offset, @Param("limit") int limit, @Param("sortColumn") String sortColumn, @Param("sortOrder") String sortOrder);

    long countSearch(@Param("keyword") String keyword);

    List<CounselingListResponse> search(@Param("keyword") String keyword, @Param("offset") int offset, @Param("limit") int limit, @Param("sortColumn") String sortColumn, @Param("sortOrder") String sortOrder);

    List<CounselingResponse> findByUserId(@Param("userId") String userId);

    CounselingResponse findById(@Param("postId") Integer postId);

    CounselingResponse findByIdAndUserId(@Param("id") Integer id, @Param("userId") String userId);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updateIsPrivate(@Param("id") Integer id, @Param("isPrivate") Boolean isPrivate);

    int deletePostById(@Param("postId") Integer postId);

    int updateById(@Param("id") Integer id, @Param("params") Map<String, Object> params);
}

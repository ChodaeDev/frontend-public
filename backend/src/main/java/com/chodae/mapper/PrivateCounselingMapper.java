package com.chodae.mapper;

import com.chodae.dto.PrivateCounselingResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface PrivateCounselingMapper {

    List<PrivateCounselingResponse> findAll();

    PrivateCounselingResponse findById(@Param("id") Integer id);

    int insert(Map<String, Object> params);

    int updateCommentCount(@Param("id") Integer id, @Param("commentCount") Integer commentCount);

    int updatePrivateNum(@Param("id") Integer id, @Param("privateNum") Integer privateNum);
}

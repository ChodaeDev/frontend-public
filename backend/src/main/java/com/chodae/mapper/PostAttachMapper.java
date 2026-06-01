package com.chodae.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostAttachMapper {

    int deleteAttachmentsByPostId(@Param("postId") Integer postId);
}

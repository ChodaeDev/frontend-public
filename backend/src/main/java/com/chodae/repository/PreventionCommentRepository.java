package com.chodae.repository;

import com.chodae.entity.PreventionComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PreventionCommentRepository extends JpaRepository<PreventionComment, Integer> {

    List<PreventionComment> findByPostIdAndIsDeletedFalseOrderByCreateDateAsc(Integer postId);

    int countByPostIdAndIsDeletedFalse(Integer postId);
}

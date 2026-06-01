package com.chodae.repository;

import com.chodae.entity.AboutComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AboutCommentRepository extends JpaRepository<AboutComment, Integer> {

    List<AboutComment> findByPostIdAndIsDeletedFalseOrderByCreateDateAsc(Integer postId);

    int countByPostIdAndIsDeletedFalse(Integer postId);
}

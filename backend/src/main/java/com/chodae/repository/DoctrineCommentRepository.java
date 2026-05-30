package com.chodae.repository;

import com.chodae.entity.DoctrineComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctrineCommentRepository extends JpaRepository<DoctrineComment, Integer> {

    List<DoctrineComment> findByVisibilityLevelOrderByCreateDateAsc(Integer visibilityLevel);

    int countByVisibilityLevel(Integer visibilityLevel);
}

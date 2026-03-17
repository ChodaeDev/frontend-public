package com.chodae.repository;

import com.chodae.entity.FreeBoardComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FreeBoardCommentRepository extends JpaRepository<FreeBoardComment, Integer> {

    List<FreeBoardComment> findByIsPrivateOrderByCreateDateAsc(Integer isPrivate);

    int countByIsPrivate(Integer isPrivate);
}

package com.chodae.repository;

import com.chodae.entity.ScjInfoComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScjInfoCommentRepository extends JpaRepository<ScjInfoComment, Integer> {

    List<ScjInfoComment> findByIsPrivateOrderByCreateDateAsc(Integer isPrivate);

    int countByIsPrivate(Integer isPrivate);
}

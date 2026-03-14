package com.chodae.repository;

import com.chodae.entity.PreventionPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PreventionPostRepository extends JpaRepository<PreventionPost, Integer> {

    List<PreventionPost> findAllByOrderByRegDtDesc();

    List<PreventionPost> findByAuthorIdOrderByRegDtDesc(String authorId);
}

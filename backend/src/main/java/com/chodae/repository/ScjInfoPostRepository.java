package com.chodae.repository;

import com.chodae.entity.ScjInfoPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScjInfoPostRepository extends JpaRepository<ScjInfoPost, Integer> {

    List<ScjInfoPost> findAllByOrderByRegDtDesc();

    List<ScjInfoPost> findByAuthorIdOrderByRegDtDesc(String authorId);
}

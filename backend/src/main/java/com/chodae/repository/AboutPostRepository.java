package com.chodae.repository;

import com.chodae.entity.AboutPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AboutPostRepository extends JpaRepository<AboutPost, Integer> {

    List<AboutPost> findAllByOrderByRegDtDesc();

    List<AboutPost> findByAuthorIdOrderByRegDtDesc(String authorId);
}

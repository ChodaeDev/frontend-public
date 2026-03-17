package com.chodae.repository;

import com.chodae.entity.DoctrinePost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctrinePostRepository extends JpaRepository<DoctrinePost, Integer> {

    List<DoctrinePost> findAllByOrderByCreateDateDesc();

    List<DoctrinePost> findByUserIdOrderByCreateDateDesc(String userId);
}

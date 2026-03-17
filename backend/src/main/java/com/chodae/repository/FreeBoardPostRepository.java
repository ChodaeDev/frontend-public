package com.chodae.repository;

import com.chodae.entity.FreeBoardPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FreeBoardPostRepository extends JpaRepository<FreeBoardPost, Integer> {

    List<FreeBoardPost> findAllByOrderByCreateDateDesc();

    List<FreeBoardPost> findByUserIdOrderByCreateDateDesc(String userId);
}

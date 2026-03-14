package com.chodae.repository;

import com.chodae.entity.BoardPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardPostRepository extends JpaRepository<BoardPost, Integer> {

    List<BoardPost> findAllByOrderByRegDtDesc();

    List<BoardPost> findByAuthorIdOrderByRegDtDesc(String authorId);
}

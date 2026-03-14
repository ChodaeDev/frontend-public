package com.chodae.repository;

import com.chodae.entity.BoardComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardCommentRepository extends JpaRepository<BoardComment, Integer> {

    List<BoardComment> findByPrivateNumOrderByRegDtAsc(Integer privateNum);

    int countByPrivateNum(Integer privateNum);
}

package com.chodae.repository;

import com.chodae.entity.WithdrawalComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WithdrawalCommentRepository extends JpaRepository<WithdrawalComment, Integer> {

    List<WithdrawalComment> findByPrivateNumOrderByRegDtAsc(Integer privateNum);

    int countByPrivateNum(Integer privateNum);
}

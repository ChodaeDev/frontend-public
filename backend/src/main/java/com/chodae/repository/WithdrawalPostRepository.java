package com.chodae.repository;

import com.chodae.entity.WithdrawalPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WithdrawalPostRepository extends JpaRepository<WithdrawalPost, Integer> {

    List<WithdrawalPost> findAllByOrderByRegDtDesc();

    List<WithdrawalPost> findByAuthorIdOrderByRegDtDesc(String authorId);
}

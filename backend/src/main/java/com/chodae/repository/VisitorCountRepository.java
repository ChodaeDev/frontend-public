package com.chodae.repository;

import com.chodae.entity.VisitorCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface VisitorCountRepository extends JpaRepository<VisitorCount, Long> {
    
    Optional<VisitorCount> findByVisitDate(LocalDate visitDate);
    
    @Query("SELECT v FROM VisitorCount v WHERE v.visitDate = :date")
    Optional<VisitorCount> findTodayVisitorCount(@Param("date") LocalDate date);
}

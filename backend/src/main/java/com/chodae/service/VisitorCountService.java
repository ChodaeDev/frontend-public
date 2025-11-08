package com.chodae.service;

import com.chodae.entity.VisitorCount;
import com.chodae.repository.VisitorCountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class VisitorCountService {
    
    @Autowired
    private VisitorCountRepository visitorCountRepository;
    
    @Transactional
    public void incrementTodayVisitorCount() {
        LocalDate today = LocalDate.now();
        VisitorCount visitorCount = visitorCountRepository.findByVisitDate(today)
                .orElse(new VisitorCount(today, 0));
        
        visitorCount.setCount(visitorCount.getCount() + 1);
        visitorCountRepository.save(visitorCount);
    }
    
    public Map<String, Object> getTodayVisitorCount() {
        LocalDate today = LocalDate.now();
        VisitorCount visitorCount = visitorCountRepository.findByVisitDate(today)
                .orElse(new VisitorCount(today, 0));
        
        Map<String, Object> result = new HashMap<>();
        result.put("date", today.toString());
        result.put("count", visitorCount.getCount());
        
        return result;
    }
}

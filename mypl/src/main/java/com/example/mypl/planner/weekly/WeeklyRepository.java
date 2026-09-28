package com.example.mypl.planner.weekly;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface WeeklyRepository extends JpaRepository<WeeklyBlock, Long> {
    List<WeeklyBlock> findByUsernameAndPlanDateBetweenOrderByPlanDateAscStartMinuteAsc(String username, LocalDate start, LocalDate end);
}

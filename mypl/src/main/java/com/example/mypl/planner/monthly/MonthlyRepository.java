package com.example.mypl.planner.monthly;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MonthlyRepository extends JpaRepository<MonthlyDay, Long> {
    Optional<MonthlyDay> findByUsernameAndPlanDate(String username, LocalDate date);
    List<MonthlyDay> findByUsernameAndPlanDateBetweenOrderByPlanDateAsc(String username, LocalDate from, LocalDate to);
}

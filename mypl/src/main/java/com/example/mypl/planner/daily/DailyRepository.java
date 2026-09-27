package com.example.mypl.planner.daily;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface DailyRepository extends JpaRepository<DailyEntity, Long> {
    // 유저 이름과 날짜로 플래너를 찾는 메서드
    Optional<DailyEntity> findByUsernameAndPlanDate(String username, LocalDate planDate);
}


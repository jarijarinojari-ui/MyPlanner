package com.example.mypl.planner.monthly;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class MonthlyPersistenceTest {
    @Autowired MonthlyService service;
    @Autowired EntityManager entityManager;
    @Test void savesReadsUpdatesAndClearsOrderedEvents() {
        String username = "monthly-test-" + UUID.randomUUID();
        LocalDate date = LocalDate.of(2026, 12, 31);
        List<String> titles = List.of("약속", "장보기", "운동", "독서", "회고");
        service.save(username, date, titles); entityManager.clear();
        assertEquals(titles, service.read(username, YearMonth.of(2026,12)).get(0).titles());
        assertTrue(service.read(username + "other", YearMonth.of(2026,12)).isEmpty());
        assertTrue(service.read(username, YearMonth.of(2027,1)).isEmpty());
        service.save(username, date, List.of("수정 일정")); entityManager.clear();
        assertEquals(List.of("수정 일정"), service.read(username, YearMonth.of(2026,12)).get(0).titles());
        service.save(username, date, List.of()); entityManager.clear();
        assertTrue(service.read(username, YearMonth.of(2026,12)).get(0).titles().isEmpty());
    }
}

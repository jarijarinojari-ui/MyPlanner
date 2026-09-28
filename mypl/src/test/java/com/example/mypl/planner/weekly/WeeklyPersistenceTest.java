package com.example.mypl.planner.weekly;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class WeeklyPersistenceTest {
    @Autowired WeeklyService service;
    @Test void savesResizesAndDeletesWithoutTouchingOtherUsersOrWeeks() {
        String user = "weekly-test-" + UUID.randomUUID();
        LocalDate date = LocalDate.of(2026, 9, 28);
        var first = new WeeklyService.Block(date, 300, 360, "개발");
        var next = new WeeklyService.Block(date.plusDays(7), 300, 330, "다음 주");
        service.save(user, date, List.of(first));
        service.save(user, date.plusDays(7), List.of(next));
        assertEquals(List.of(first), service.read(user, date));
        assertTrue(service.read(user + "-other", date).isEmpty());
        var resized = new WeeklyService.Block(date, 300, 1620, "긴 기록");
        service.save(user, date, List.of(resized));
        assertEquals(List.of(resized), service.read(user, date));
        service.save(user, date, List.of());
        assertTrue(service.read(user, date).isEmpty());
        assertEquals(List.of(next), service.read(user, date.plusDays(7)));
    }
}

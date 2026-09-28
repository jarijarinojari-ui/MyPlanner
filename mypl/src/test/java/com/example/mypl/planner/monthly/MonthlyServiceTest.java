package com.example.mypl.planner.monthly;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MonthlyServiceTest {
    private final MonthlyRepository repository = mock(MonthlyRepository.class);
    private final MonthlyService service = new MonthlyService(repository);
    private final LocalDate date = LocalDate.of(2026, 9, 28);
    @Test void rejectsSixItemsBlankAndLongTitlesBeforeWriting() {
        for (var titles : List.of(List.of("1","2","3","4","5","6"), List.of(" "), List.of("가".repeat(21)))) {
            assertThrows(ResponseStatusException.class, () -> service.save("user", date, titles));
        }
        verifyNoInteractions(repository);
    }
    @Test void replacesItemsInOrderAndAllowsDeletingAll() {
        MonthlyDay day = new MonthlyDay(); day.setPlanDate(date); day.getTitles().add("기존 일정");
        when(repository.findByUsernameAndPlanDate("user", date)).thenReturn(Optional.of(day));
        var titles = List.of("1","2","3","4","5");
        assertEquals(titles, service.save("user", date, titles).titles());
        assertTrue(service.save("user", date, List.of()).titles().isEmpty());
    }
    @Test void leapFebruaryUsesCorrectUserAndRange() {
        when(repository.findByUsernameAndPlanDateBetweenOrderByPlanDateAsc(any(), any(), any())).thenReturn(List.of());
        service.read("user", YearMonth.of(2028,2));
        verify(repository).findByUsernameAndPlanDateBetweenOrderByPlanDateAsc("user", LocalDate.of(2028,2,1), LocalDate.of(2028,2,29));
    }
}

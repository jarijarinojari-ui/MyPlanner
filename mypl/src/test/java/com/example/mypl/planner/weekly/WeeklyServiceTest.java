package com.example.mypl.planner.weekly;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class WeeklyServiceTest {
    private final LocalDate monday = LocalDate.of(2026, 9, 28);
    private WeeklyService.Block block(int start, int end, String memo) {
        return new WeeklyService.Block(monday, start, end, memo);
    }
    @Test void acceptsFullDayHalfHourAndTwentyCharacters() {
        assertDoesNotThrow(() -> WeeklyService.validate(monday, List.of(block(300, 1620, "가".repeat(20)))));
        assertDoesNotThrow(() -> WeeklyService.validate(monday, List.of(block(1590, 1620, "밤"))));
    }
    @Test void rejectsOverlapAndAllowsAdjacentBlocks() {
        assertThrows(ResponseStatusException.class, () -> WeeklyService.validate(monday, List.of(block(300, 360, ""), block(330, 390, ""))));
        assertDoesNotThrow(() -> WeeklyService.validate(monday, List.of(block(300, 360, ""), block(360, 390, ""))));
    }
    @Test void rejectsInvalidRangePrecisionMemoAndDate() {
        for (var invalid : List.of(block(270, 330, ""), block(1590, 1650, ""), block(300, 300, ""),
                block(305, 365, ""), block(300, 360, "가".repeat(21)),
                new WeeklyService.Block(monday.plusDays(7), 300, 360, ""))) {
            assertThrows(ResponseStatusException.class, () -> WeeklyService.validate(monday, List.of(invalid)));
        }
    }
    @Test void validationFailureDoesNotDeleteSavedRecords() {
        WeeklyRepository repository = mock(WeeklyRepository.class);
        assertThrows(ResponseStatusException.class, () -> new WeeklyService(repository).save("alice", monday, List.of(block(0, 30, ""))));
        verifyNoInteractions(repository);
    }
    @Test void readsOnlyRequestedUserAndWeek() {
        WeeklyRepository repository = mock(WeeklyRepository.class);
        when(repository.findByUsernameAndPlanDateBetweenOrderByPlanDateAscStartMinuteAsc("alice", monday, monday.plusDays(6))).thenReturn(List.of());
        assertTrue(new WeeklyService(repository).read("alice", monday).isEmpty());
        verify(repository).findByUsernameAndPlanDateBetweenOrderByPlanDateAscStartMinuteAsc("alice", monday, monday.plusDays(6));
    }
}

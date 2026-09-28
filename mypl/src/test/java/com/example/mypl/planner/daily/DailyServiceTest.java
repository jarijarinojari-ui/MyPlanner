package com.example.mypl.planner.daily;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DailyServiceTest {
    private final DailyRepository repository = mock(DailyRepository.class);
    private final DailyService service = new DailyService(repository);
    private final LocalDate date = LocalDate.of(2026, 9, 28);

    @Test void readsEmptyDayForCurrentUser() {
        when(repository.findByUsernameAndPlanDate("alice", date)).thenReturn(Optional.empty());
        DailyDTO result = service.getDaily("alice", date);
        assertEquals(date, result.getPlanDate());
        assertTrue(result.getGoals().isEmpty());
        assertEquals("", result.getMemo());
    }
    @Test void separatesGoalsAndTodosAndPreservesCompletion() {
        DailyEntity entity = new DailyEntity();
        PlanEntity goal = new PlanEntity(); goal.setContent("목표"); goal.setType("GOAL"); goal.setDone(true);
        PlanEntity todo = new PlanEntity(); todo.setContent("할 일"); todo.setType("TODO");
        entity.getItems().add(goal); entity.getItems().add(todo);
        when(repository.findByUsernameAndPlanDate("alice", date)).thenReturn(Optional.of(entity));
        DailyDTO result = service.getDaily("alice", date);
        assertEquals(1, result.getGoals().size()); assertTrue(result.getGoals().get(0).isDone());
        assertEquals("할 일", result.getTodos().get(0).getContent());
    }
    @Test void clearsExistingItemsWithoutReplacingManagedCollection() {
        DailyEntity entity = new DailyEntity(); entity.getItems().add(new PlanEntity());
        var collection = entity.getItems();
        when(repository.findByUsernameAndPlanDate("alice", date)).thenReturn(Optional.of(entity));
        DailyDTO dto = new DailyDTO(); dto.setPlanDate(date); dto.setMemo("새 기록");
        service.saveOrUpdateDaily("alice", dto);
        assertSame(collection, entity.getItems()); assertTrue(collection.isEmpty());
        assertEquals("새 기록", entity.getMemo()); verify(repository).save(entity);
    }
    @Test void rejectsMissingDateBeforeWriting() {
        assertThrows(ResponseStatusException.class, () -> service.saveOrUpdateDaily("alice", new DailyDTO()));
        verifyNoInteractions(repository);
    }
}

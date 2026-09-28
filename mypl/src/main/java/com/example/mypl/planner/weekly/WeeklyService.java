package com.example.mypl.planner.weekly;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class WeeklyService {
    public record Block(LocalDate planDate, int startMinute, int endMinute, String memo) {}
    private final WeeklyRepository repository;


    public List<Block> read(String username, LocalDate start) {
        return repository.findByUsernameAndPlanDateBetweenOrderByPlanDateAscStartMinuteAsc(username, start, start.plusDays(6))
                .stream().map(b -> new Block(b.getPlanDate(), b.getStartMinute(), b.getEndMinute(), b.getMemo())).toList();
    }


    public void save(String username, LocalDate start, List<Block> blocks) {
        validate(start, blocks);
        repository.deleteAll(repository.findByUsernameAndPlanDateBetweenOrderByPlanDateAscStartMinuteAsc(username, start, start.plusDays(6)));
        repository.saveAll(blocks.stream().map(b -> {
            WeeklyBlock entity = new WeeklyBlock();
            entity.setUsername(username); entity.setPlanDate(b.planDate());
            entity.setStartMinute(b.startMinute()); entity.setEndMinute(b.endMinute()); entity.setMemo(b.memo());
            return entity;
        }).toList());
    }

    static void validate(LocalDate start, List<Block> blocks) {
        if (start == null || blocks == null || blocks.size() > 308) invalid();
        Map<LocalDate, boolean[]> occupied = new HashMap<>();
        for (Block block : blocks) {
            if (block == null || block.planDate() == null || block.planDate().isBefore(start)
                    || block.planDate().isAfter(start.plusDays(6)) || block.startMinute() < 300
                    || block.startMinute() >= 1620 || block.endMinute() < 330 || block.endMinute() > 1620 || block.endMinute() - block.startMinute() < 30
                    || block.startMinute() % 30 != 0 || block.endMinute() % 30 != 0
                    || block.memo() == null || block.memo().codePointCount(0, block.memo().length()) > 20) invalid();
            boolean[] slots = occupied.computeIfAbsent(block.planDate(), key -> new boolean[44]);
            for (int i = (block.startMinute() - 300) / 30; i < (block.endMinute() - 300) / 30; i++) {
                if (slots[i]) invalid();
                slots[i] = true;
            }
        }
    }

    private static void invalid() {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "시간은 05:00~다음 날 03:00, 30분 단위이며 메모는 20자까지 입력할 수 있어요. 블록은 겹칠 수 없어요.");
    }
}

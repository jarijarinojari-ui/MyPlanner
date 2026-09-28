package com.example.mypl.planner.monthly;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MonthlyService {
    public record Day(LocalDate planDate, List<String> titles) {}
    private final MonthlyRepository repository;

    @Transactional
    public List<Day> read(String username, YearMonth month) {
        return repository.findByUsernameAndPlanDateBetweenOrderByPlanDateAsc(username, month.atDay(1), month.atEndOfMonth())
                .stream().map(day -> new Day(day.getPlanDate(), List.copyOf(day.getTitles()))).toList();
    }

    @Transactional
    public Day save(String username, LocalDate date, List<String> titles) {
        if (titles == null || titles.size() > 5 || titles.stream().anyMatch(title -> title == null
                || title.isBlank() || title.codePointCount(0, title.length()) > 20)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "일정은 하루 5개, 각 1~20자까지 입력할 수 있어요.");
        }
        MonthlyDay day = repository.findByUsernameAndPlanDate(username, date).orElseGet(() -> {
            MonthlyDay created = new MonthlyDay(); created.setUsername(username); created.setPlanDate(date); return created;
        });
        day.getTitles().clear();
        day.getTitles().addAll(titles.stream().map(String::trim).toList());
        repository.saveAndFlush(day);
        return new Day(date, List.copyOf(day.getTitles()));
    }
}

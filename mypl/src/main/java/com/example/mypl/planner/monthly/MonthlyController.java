package com.example.mypl.planner.monthly;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/monthly")
@RequiredArgsConstructor
public class MonthlyController {
    private final MonthlyService service;
    @GetMapping
    public List<MonthlyService.Day> read(@AuthenticationPrincipal UserDetails user, @RequestParam String month) {
        try { return service.read(user.getUsername(), YearMonth.parse(month)); }
        catch (java.time.format.DateTimeParseException exception) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "월 형식은 YYYY-MM이에요.");
        }
    }
    @PutMapping
    public MonthlyService.Day save(@AuthenticationPrincipal UserDetails user, @RequestParam LocalDate date, @RequestBody List<String> titles) {
        return service.save(user.getUsername(), date, titles);
    }
}

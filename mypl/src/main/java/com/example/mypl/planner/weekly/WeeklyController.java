package com.example.mypl.planner.weekly;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/weekly")
@RequiredArgsConstructor
public class WeeklyController {
    private final WeeklyService service;
    @GetMapping
    public List<WeeklyService.Block> read(@AuthenticationPrincipal UserDetails user, @RequestParam LocalDate start) {
        return service.read(user.getUsername(), start);
    }
    @PutMapping
    public void save(@AuthenticationPrincipal UserDetails user, @RequestParam LocalDate start,
                     @RequestBody List<WeeklyService.Block> blocks) {
        service.save(user.getUsername(), start, blocks);
    }
}

package com.example.mypl.planner.focus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
@RestController @RequestMapping("/api/focus") @RequiredArgsConstructor
public class FocusController {
    private final FocusService service;
    @GetMapping public List<FocusService.Entry> read(@AuthenticationPrincipal UserDetails user,@RequestParam Instant from,@RequestParam Instant until) {
        return service.read(user.getUsername(),from,until);
    }
    @GetMapping("/recent-titles") public List<String> recentTitles(@AuthenticationPrincipal UserDetails user) {
        return service.recentTitles(user.getUsername());
    }
    @PostMapping public FocusService.Entry start(@AuthenticationPrincipal UserDetails user,@RequestBody FocusService.Start input) {
        return service.start(user.getUsername(),input);
    }
    @PostMapping("/{id}/heartbeat") public FocusService.Entry heartbeat(@AuthenticationPrincipal UserDetails user,@PathVariable String id) {
        return service.update(user.getUsername(),id,false,null);
    }
    @PostMapping("/{id}/finish") public FocusService.Entry finish(@AuthenticationPrincipal UserDetails user,@PathVariable String id,@RequestParam(defaultValue="finished") String reason) {
        return service.update(user.getUsername(),id,true,reason);
    }
}

package com.example.mypl.planner.daily;

import com.example.mypl.planner.daily.DailyDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/daily")
@RequiredArgsConstructor
public class DailyController {

    private final DailyService dailyService;

    @GetMapping
    public DailyDTO getDaily(@AuthenticationPrincipal UserDetails userDetails,
            @RequestParam java.time.LocalDate date) {
        return dailyService.getDaily(userDetails.getUsername(), date);
    }

    // 데일리 플래너 저장 (또는 수정)
    @PostMapping
    public ResponseEntity<String> saveDaily(
            @AuthenticationPrincipal UserDetails userDetails, // ⭐ 시큐리티에서 로그인 유저 정보 가져오기
            @RequestBody DailyDTO requestDto) {

        // 로그인한 유저의 아이디(혹은 username) 추출
        String username = userDetails.getUsername();

        dailyService.saveOrUpdateDaily(username, requestDto);

        return ResponseEntity.ok("플래너가 성공적으로 저장되었습니다.");
    }
}

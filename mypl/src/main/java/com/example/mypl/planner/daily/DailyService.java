package com.example.mypl.planner.daily;

import com.example.mypl.planner.daily.DailyDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyService {

    private final DailyRepository dailyRepository;

    @Transactional
    public void saveOrUpdateDaily(String username, DailyDTO dto) {
        // 1. 기존 플래너 찾기 or 새로 만들기
        DailyEntity dailyEntity = dailyRepository.findByUsernameAndPlanDate(username, dto.getPlanDate())
                .orElseGet(() -> {
                    DailyEntity newDaily = new DailyEntity();
                    newDaily.setUsername(username);
                    newDaily.setPlanDate(dto.getPlanDate());
                    return newDaily;
                });

        // 2. 메모 업데이트
        dailyEntity.setMemo(dto.getMemo());

        // 3. ⭐ 팩트체크 당한 부분: DTO -> Entity 변환 및 세팅

        // 목표(Goals) 리스트가 비어있지 않다면 변환
        if (dto.getGoals() != null) {
            List<PlanEntity> goalEntities = dto.getGoals().stream().map(itemDto -> {
                PlanEntity entity = new PlanEntity();
                entity.setContent(itemDto.getContent());
                entity.setDone(itemDto.isDone()); // boolean값 체크
                entity.setType("GOAL"); // 타입 고정
                return entity;
            }).toList(); // (Java 16 이상 기준. 이하라면 .collect(Collectors.toList()) 사용)

            dailyEntity.setGoals(goalEntities); // 엔티티에 꽂아넣기
        }

        // 할 일(Todos) 리스트가 비어있지 않다면 변환
        if (dto.getTodos() != null) {
            List<PlanEntity> todoEntities = dto.getTodos().stream().map(itemDto -> {
                PlanEntity entity = new PlanEntity();
                entity.setContent(itemDto.getContent());
                entity.setDone(itemDto.isDone());
                entity.setType("TODO"); // 타입 고정
                return entity;
            }).toList();

            dailyEntity.setTodos(todoEntities); // 엔티티에 꽂아넣기
        }

        // 4. DB에 최종 저장
        dailyRepository.save(dailyEntity);
    }
}

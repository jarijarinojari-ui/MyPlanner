package com.example.mypl.planner.daily;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyService {
    private final DailyRepository dailyRepository;

    @Transactional(readOnly = true)
    public DailyDTO getDaily(String username, LocalDate date) {
        DailyDTO result = new DailyDTO();
        result.setPlanDate(date);
        dailyRepository.findByUsernameAndPlanDate(username, date).ifPresent(entity -> {
            result.setMemo(entity.getMemo() == null ? "" : entity.getMemo());
            for (PlanEntity item : entity.getItems()) {
                DailyDTO.PlanItemDto dto = new DailyDTO.PlanItemDto();
                dto.setContent(item.getContent());
                dto.setDone(item.isDone());
                if ("GOAL".equals(item.getType())) result.getGoals().add(dto);
                else if ("TODO".equals(item.getType())) result.getTodos().add(dto);
            }
        });
        return result;
    }

    @Transactional
    public void saveOrUpdateDaily(String username, DailyDTO dto) {
        if (dto.getPlanDate() == null) invalid("날짜를 선택해 주세요.");
        validateItems(dto.getGoals());
        validateItems(dto.getTodos());
        if (dto.getMemo() != null && dto.getMemo().length() > 10000) invalid("메모는 10,000자까지 입력할 수 있어요.");
        DailyEntity entity = dailyRepository.findByUsernameAndPlanDate(username, dto.getPlanDate())
                .orElseGet(() -> {
                    DailyEntity created = new DailyEntity();
                    created.setUsername(username);
                    created.setPlanDate(dto.getPlanDate());
                    return created;
                });
        entity.setMemo(dto.getMemo() == null ? "" : dto.getMemo());
        entity.getItems().clear();
        addItems(entity, dto.getGoals(), "GOAL");
        addItems(entity, dto.getTodos(), "TODO");
        dailyRepository.save(entity);
    }

    private void validateItems(List<DailyDTO.PlanItemDto> items) {
        if (items == null || items.size() > 100) invalid("각 목록은 100개까지 입력할 수 있어요.");
        for (DailyDTO.PlanItemDto item : items) {
            if (item == null || item.getContent() == null || item.getContent().isBlank()
                    || item.getContent().length() > 255) invalid("항목은 1~255자로 입력해 주세요.");
        }
    }

    private void addItems(DailyEntity entity, List<DailyDTO.PlanItemDto> items, String type) {
        for (DailyDTO.PlanItemDto dto : items) {
            PlanEntity item = new PlanEntity();
            item.setContent(dto.getContent().trim());
            item.setDone(dto.isDone());
            item.setType(type);
            entity.getItems().add(item);
        }
    }

    private void invalid(String message) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}

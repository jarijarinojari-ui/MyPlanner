package com.example.mypl.planner.daily;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter
public class DailyDTO {
    private LocalDate planDate;
    private List<PlanItItemDto> goals;
    private List<PlanItItemDto> todos;
    private String memo;
}

@Getter @Setter
class PlanItItemDto {
    private String content;
    private boolean isDone;
    private String type; // "GOAL" or "TODO"
}

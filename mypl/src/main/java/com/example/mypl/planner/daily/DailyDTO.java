package com.example.mypl.planner.daily;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
public class DailyDTO {
    private LocalDate planDate;
    private List<PlanItemDto> goals = new ArrayList<>();
    private List<PlanItemDto> todos = new ArrayList<>();
    private String memo = "";

    @Getter @Setter
    public static class PlanItemDto {
        private String content;
        private boolean done;
    }
}

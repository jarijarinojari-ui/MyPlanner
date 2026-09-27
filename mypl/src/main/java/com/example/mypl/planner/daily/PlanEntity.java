package com.example.mypl.planner.daily;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class PlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 할 일/목표도 각자의 고유 번호가 필요함

    private String content; // 내용 (예: "회피하지 않기")

    private boolean isDone; // 체크박스 상태 (true/false)

    // 어떤 타입인지(목표인지 할 일인지) 구분하기 위한 값
    private String type; // 예: "GOAL" 또는 "TODO"
}

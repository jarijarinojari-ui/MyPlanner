package com.example.mypl.planner.weekly;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter @Setter
public class WeeklyBlock {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    private LocalDate planDate;
    private int startMinute;
    private int endMinute;
    @Column(length = 80, nullable = false)
    private String memo;
}

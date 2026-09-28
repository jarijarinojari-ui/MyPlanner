package com.example.mypl.planner.monthly;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"username", "planDate"}))
public class MonthlyDay {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Version
    private Long version;
    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    private LocalDate planDate;
    @ElementCollection
    @OrderColumn(name = "position")
    @Column(name = "title", length = 80, nullable = false)
    private List<String> titles = new ArrayList<>();
}

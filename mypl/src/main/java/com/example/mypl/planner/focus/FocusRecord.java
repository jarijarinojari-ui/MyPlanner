package com.example.mypl.planner.focus;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;

@Entity @Getter
@Table(indexes = @Index(name="focus_user_start_idx", columnList="username,startedAt"))
public class FocusRecord {
    @Id String id;
    @Column(nullable=false) String username;
    @Column(nullable=false, length=80) String title;
    @Column(nullable=false) String mode;
    @Column(nullable=false) Instant startedAt;
    @Column(nullable=false) Instant lastSeenAt;
    Instant endedAt;
    int targetSeconds;
    String reason;
    protected FocusRecord() {}
}

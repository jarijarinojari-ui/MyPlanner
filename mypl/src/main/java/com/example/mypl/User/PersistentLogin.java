package com.example.mypl.User;

import jakarta.persistence.*;
import java.util.Date;
import java.time.Instant;

@Entity
@Table(name = "persistent_login", indexes = @Index(name = "persistent_login_username_idx", columnList = "username"))
class PersistentLogin {
    @Id @Column(length = 64) String series;
    @Column(nullable = false, length = 64) String token;
    @Column(nullable = false) String username;
    @Column(nullable = false) Instant lastUsed;

    protected PersistentLogin() {}

    PersistentLogin(String series, String token, String username, Date lastUsed) {
        this.series = series; this.token = token; this.username = username; this.lastUsed = lastUsed.toInstant();
    }
}

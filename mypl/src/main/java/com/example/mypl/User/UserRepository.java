package com.example.mypl.User;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository< UserEntity, Long> {


    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select u from UserEntity u where u.username = :username")
    Optional<UserEntity> lockByUsername(String username);

    boolean existsByName(String name);

    Optional<UserEntity> findByUsername(String username);
}

package com.example.mypl.User;


import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository< UserEntity, Integer> {
}

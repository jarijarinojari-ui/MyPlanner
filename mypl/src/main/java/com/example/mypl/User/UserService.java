package com.example.mypl.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserEntity singUp(UserEntity user) throws Exception{
        try {
            System.out.println(user);
            var hash = passwordEncoder.encode(user.getPassword());

            System.out.println(hash.toString());
            user.setPassword(hash);
            userRepository.save(user);
            return user;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return user;
    }
}

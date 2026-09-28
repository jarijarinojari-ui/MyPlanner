package com.example.mypl.User;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register(SignupForm form) {
        String username = clean(form.getUsername());
        String name = clean(form.getName());
        String email = clean(form.getEmail());
        String password = form.getPassword();
        if (!username.matches("[a-zA-Z0-9_]{4,20}"))
            throw new IllegalArgumentException("아이디는 영문, 숫자, 밑줄로 4~20자 입력해 주세요.");
        if (name.length() < 2 || name.length() > 20)
            throw new IllegalArgumentException("닉네임은 2~20자로 입력해 주세요.");
        if (email.length() > 254 || !email.matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+"))
            throw new IllegalArgumentException("올바른 이메일 주소를 입력해 주세요.");
        if (password == null || password.length() < 8 || password.getBytes(StandardCharsets.UTF_8).length > 72)
            throw new IllegalArgumentException("비밀번호는 8자 이상, UTF-8 기준 72바이트 이하로 입력해 주세요.");
        if (!Objects.equals(password, form.getPasswordConfirm()))
            throw new IllegalArgumentException("비밀번호 확인이 일치하지 않아요.");
        if (userRepository.findByUsername(username).isPresent())
            throw new IllegalArgumentException("이미 사용 중인 아이디예요.");
        if (userRepository.existsByName(name))
            throw new IllegalArgumentException("이미 사용 중인 닉네임이에요.");
        UserEntity user = new UserEntity();
        user.setUsername(username); user.setName(name); user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.saveAndFlush(user);
    }

    private String clean(String value) { return value == null ? "" : value.trim(); }
}

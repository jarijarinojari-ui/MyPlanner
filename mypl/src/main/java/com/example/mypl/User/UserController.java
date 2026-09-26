package com.example.mypl.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class UserController {

    //private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("/home")
    public String home(Model model){
        return "home.html";
    }

    @Transactional
    @PostMapping("/adduser")
    public String singUp(@ModelAttribute UserEntity user) throws Exception{

        userService.singUp(user);

        return "redirect:/home";
    }

    @GetMapping("/singup")
    public String singup(Model model) {
        return "/singup.html";
    }



}

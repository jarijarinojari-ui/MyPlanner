package com.example.mypl.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/login")
    public String login(Model model) {
        return "/login.html";
    }

    @GetMapping("/LGUS")
    @ResponseBody
    public String LGUS(Authentication authentication) throws Exception {
        if (authentication == null) {
            return "유저업음";
        }
        authentication.getAuthorities().toString();
        return authentication.getName();
    }


}

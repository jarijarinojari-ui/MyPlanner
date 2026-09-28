package com.example.mypl.User;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/")
    public String landing() { return "landing"; }

    @GetMapping("/home")
    public String home() { return "home"; }

    @GetMapping({"/signup", "/singup"})
    public String signup(Model model) {
        model.addAttribute("form", new SignupForm());
        return "singup";
    }

    @PostMapping("/adduser")
    public String signup(@ModelAttribute("form") SignupForm form, Model model) {
        try {
            userService.register(form);
            return "redirect:/login?registered";
        } catch (IllegalArgumentException exception) {
            model.addAttribute("error", exception.getMessage());
        } catch (DataIntegrityViolationException exception) {
            model.addAttribute("error", "이미 사용 중인 아이디 또는 닉네임이에요.");
        }
        form.setPassword(null);
        form.setPasswordConfirm(null);
        return "singup";
    }

    @GetMapping("/login")
    public String login() { return "login"; }
}

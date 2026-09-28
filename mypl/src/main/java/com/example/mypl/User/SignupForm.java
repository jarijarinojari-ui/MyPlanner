package com.example.mypl.User;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SignupForm {
    private String username;
    private String name;
    private String email;
    private String password;
    private String passwordConfirm;
}

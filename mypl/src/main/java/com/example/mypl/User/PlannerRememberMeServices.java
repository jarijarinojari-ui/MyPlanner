package com.example.mypl.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.rememberme.PersistentTokenBasedRememberMeServices;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

public class PlannerRememberMeServices extends PersistentTokenBasedRememberMeServices {
    public PlannerRememberMeServices(String key, UserDetailsService users, PersistentTokenRepository tokens) {
        super(key, users, tokens);
        setAlwaysRemember(true);
        setTokenValiditySeconds(30 * 24 * 60 * 60);
        setCookieName("planner-login");
        setCookieCustomizer(cookie -> cookie.setAttribute("SameSite", "Lax"));
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        // LogoutFilter runs before RememberMeAuthenticationFilter. Validate a remaining
        // cookie when the session has already expired so logout also revokes the DB token.
        if (authentication == null) authentication = autoLogin(request, response);
        super.logout(request, response, authentication);
    }
}

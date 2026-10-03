package com.example.mypl.User;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final String rememberKey = java.util.UUID.randomUUID().toString();

    @Bean
    PlannerRememberMeServices rememberMeServices(MyUserDetailsService users, JpaLoginTokenRepository tokens) {
        return new PlannerRememberMeServices(rememberKey, users, tokens);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, PlannerRememberMeServices rememberMeServices) throws Exception {
        http.csrf((csrf -> csrf.disable()));
        http.authorizeHttpRequests((authorize) ->
                authorize.requestMatchers("/api/focus/**", "/api/daily/**", "/api/weekly/**", "/api/monthly/**", "/home").authenticated()
                        .anyRequest().permitAll()
        );
        http.exceptionHandling(errors -> errors.authenticationEntryPoint((request, response, exception) -> {
            if (request.getRequestURI().startsWith("/api/")) {
                response.sendError(401);
            } else {
                new org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint("/login")
                        .commence(request, response, exception);
            }
        }));
        http.formLogin((formLogin)
                -> formLogin.loginPage("/login")
                .defaultSuccessUrl("/home", true)

        );
        http.rememberMe(remember -> remember.key(rememberKey).rememberMeServices(rememberMeServices));
        http.logout( logout -> logout.logoutUrl("/logout").logoutSuccessUrl("/login?logout") );
        return http.build();
    }
}


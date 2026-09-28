package com.example.mypl.User;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.ui.ExtendedModelMap;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SignupTest {
    private final UserRepository repository = mock(UserRepository.class);
    private final PasswordEncoder encoder = mock(PasswordEncoder.class);
    private final UserService service = new UserService(repository, encoder);
    private SignupForm form() {
        SignupForm form = new SignupForm(); form.setUsername("planner1"); form.setName("플래너");
        form.setEmail("hello@example.com"); form.setPassword("my-password"); form.setPasswordConfirm("my-password");
        return form;
    }
    @Test void savesEncodedPassword() {
        when(encoder.encode("my-password")).thenReturn("encoded");
        service.register(form());
        verify(repository).saveAndFlush(argThat(user -> user.getPassword().equals("encoded") && user.getEmail().equals("hello@example.com")));
    }
    @Test void rejectsInvalidEmailMismatchAndDuplicate() {
        var form = form(); form.setEmail("bad@email");
        assertThrows(IllegalArgumentException.class, () -> service.register(form));
        form.setEmail("hello@example.com"); form.setPasswordConfirm("different");
        assertThrows(IllegalArgumentException.class, () -> service.register(form));
        form.setPasswordConfirm(form.getPassword());
        when(repository.findByUsername("planner1")).thenReturn(Optional.of(new UserEntity()));
        assertThrows(IllegalArgumentException.class, () -> service.register(form));
        verify(repository, never()).saveAndFlush(any());
    }
    @Test void failureKeepsProfileButClearsPasswords() {
        var form = form(); form.setPasswordConfirm("different"); var model = new ExtendedModelMap();
        assertEquals("singup", new UserController(service).signup(form, model));
        assertNotNull(model.get("error")); assertNull(form.getPassword()); assertNull(form.getPasswordConfirm());
        assertEquals("planner1", form.getUsername());
    }
    @Test void unknownUserUsesNormalLoginFailure() {
        assertThrows(UsernameNotFoundException.class, () -> new MyUserDetailsService(repository).loadUserByUsername("missing"));
    }
}

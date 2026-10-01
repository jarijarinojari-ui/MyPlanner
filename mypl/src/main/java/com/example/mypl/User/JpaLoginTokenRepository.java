package com.example.mypl.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.web.authentication.rememberme.PersistentRememberMeToken;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import java.util.Date;

/** Random persistent-login tokens survive application restarts and rotate on auto-login. */
@Repository
@Transactional
public class JpaLoginTokenRepository implements PersistentTokenRepository {
    @PersistenceContext private EntityManager entityManager;

    @Override
    public void createNewToken(PersistentRememberMeToken token) {
        entityManager.persist(new PersistentLogin(token.getSeries(), token.getTokenValue(), token.getUsername(), token.getDate()));
    }

    @Override
    public void updateToken(String series, String tokenValue, Date lastUsed) {
        var token = entityManager.find(PersistentLogin.class, series);
        if (token != null) { token.token = tokenValue; token.lastUsed = lastUsed.toInstant(); }
    }

    @Override
    @Transactional(readOnly = true)
    public PersistentRememberMeToken getTokenForSeries(String series) {
        var token = entityManager.find(PersistentLogin.class, series);
        return token == null ? null : new PersistentRememberMeToken(token.username, token.series, token.token, Date.from(token.lastUsed));
    }

    @Override
    public void removeUserTokens(String username) {
        entityManager.createQuery("delete from PersistentLogin where username = :username")
                .setParameter("username", username).executeUpdate();
    }
}

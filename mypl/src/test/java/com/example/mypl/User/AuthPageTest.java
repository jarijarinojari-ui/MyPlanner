package com.example.mypl.User;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Value;
import java.net.URI;
import java.net.http.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "spring.datasource.url=jdbc:h2:mem:auth;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver", "spring.datasource.username=sa",
        "spring.datasource.password=", "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
})
class AuthPageTest {
    @org.springframework.test.context.bean.override.mockito.MockitoBean
    MyUserDetailsService userDetailsService;

    @Test void existingSessionSkipsLandingAndLoginUntilLogout() throws Exception {
        org.mockito.Mockito.when(userDetailsService.loadUserByUsername("session-test")).thenReturn(
                org.springframework.security.core.userdetails.User.withUsername("session-test")
                        .password(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("test-password"))
                        .roles("USER").build());
        var cookies = new java.net.CookieManager(null, java.net.CookiePolicy.ACCEPT_ALL);
        var session = HttpClient.newBuilder().cookieHandler(cookies).build();
        var login = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/login"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString("username=session-test&password=test-password")).build();
        var response = session.send(login, HttpResponse.BodyHandlers.ofString());
        assertEquals(302, response.statusCode());
        assertTrue(response.headers().firstValue("location").orElseThrow().endsWith("/home"));
        for (String path : new String[]{"/", "/login"}) {
            var redirected = session.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).GET().build(), HttpResponse.BodyHandlers.ofString());
            assertEquals(302, redirected.statusCode());
            assertTrue(redirected.headers().firstValue("location").orElseThrow().endsWith("/home"));
        }
        var planner = session.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/home")).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(200, planner.statusCode());
        session.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/logout")).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(200, session.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/")).GET().build(), HttpResponse.BodyHandlers.ofString()).statusCode());
    }

    @org.springframework.beans.factory.annotation.Autowired
    JpaLoginTokenRepository tokens;

    @Test void cookieRestoresLoginWithoutSessionRotatesAndIsRevokedOnLogout() throws Exception {
        String cookie = loginCookie("remember-test");
        assertNotNull(tokens.getTokenForSeries(series(cookie)));
        // No JSESSIONID: only the persistent cookie remains after reopening the browser.
        var restored = withCookie("/", cookie);
        assertEquals(302, restored.statusCode());
        assertTrue(restored.headers().firstValue("location").orElseThrow().endsWith("/home"));
        String rotated = persistentCookie(restored);
        assertNotEquals(cookie, rotated);
        assertEquals(series(cookie), series(rotated));
        var planner = withCookie("/home", rotated);
        assertEquals(200, planner.statusCode());
        String latest = persistentCookie(planner);
        var logout = withCookie("/logout", latest);
        assertEquals(302, logout.statusCode());
        assertNull(tokens.getTokenForSeries(series(latest)));
        assertEquals(302, withCookie("/home", latest).statusCode());
        assertTrue(logout.headers().allValues("set-cookie").stream()
                .flatMap(value -> java.net.HttpCookie.parse(value).stream())
                .anyMatch(cookieValue -> cookieValue.getName().equals("planner-login") && cookieValue.hasExpired()));
    }

    @Test void expiredAndTamperedCookiesCannotAuthenticate() throws Exception {
        String cookie = loginCookie("expired-test");
        var token = tokens.getTokenForSeries(series(cookie));
        tokens.updateToken(token.getSeries(), token.getTokenValue(), java.util.Date.from(java.time.Instant.now().minus(31, java.time.temporal.ChronoUnit.DAYS)));
        assertEquals(302, withCookie("/home", cookie).statusCode());
        assertEquals(401, withCookie("/api/weekly?start=2026-09-28", "planner-login=invalid").statusCode());
    }

    private String loginCookie(String username) throws Exception {
        org.mockito.Mockito.when(userDetailsService.loadUserByUsername(username)).thenReturn(
                org.springframework.security.core.userdetails.User.withUsername(username)
                        .password(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("test-password"))
                        .roles("USER").build());
        var request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/login"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString("username=" + username + "&password=test-password")).build();
        var response = client.send(request, HttpResponse.BodyHandlers.ofString());
        assertEquals(302, response.statusCode());
        String header = response.headers().allValues("set-cookie").stream().filter(value -> value.startsWith("planner-login=")).findFirst().orElseThrow();
        assertTrue(header.contains("HttpOnly"));
        assertTrue(header.contains("SameSite=Lax"));
        assertTrue(header.contains("Max-Age=2592000"));
        return header.split(";", 2)[0];
    }

    private String persistentCookie(HttpResponse<String> response) {
        return response.headers().allValues("set-cookie").stream().filter(value -> value.startsWith("planner-login="))
                .findFirst().orElseThrow().split(";", 2)[0];
    }

    private String series(String cookie) {
        return java.net.URLDecoder.decode(new String(java.util.Base64.getDecoder().decode(cookie.substring("planner-login=".length())), java.nio.charset.StandardCharsets.UTF_8).split(":")[0], java.nio.charset.StandardCharsets.UTF_8);
    }

    private HttpResponse<String> withCookie(String path, String cookie) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).header("Cookie", cookie).GET().build(), HttpResponse.BodyHandlers.ofString());
    }

    @Value("${local.server.port}") int port;
    private final HttpClient client = HttpClient.newHttpClient();
    private HttpResponse<String> get(String path) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).GET().build(), HttpResponse.BodyHandlers.ofString());
    }
    @Test void publicPagesRenderAndPlannerRequiresLogin() throws Exception {
        for (String path : new String[]{"/", "/login", "/signup", "/singup"}) {
            var response = get(path); assertEquals(200, response.statusCode(), path);
            assertTrue(response.body().contains("my planner"));
            assertFalse(response.body().contains("th:if"));
        }
        assertEquals(302, get("/home").statusCode());
        assertEquals(401, get("/api/weekly?start=2026-09-28").statusCode());
    }
    @Test void invalidSignupShowsValidationWithoutStoringPasswordInHtml() throws Exception {
        var request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/adduser"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString("username=x&name=test&email=a%40b.com&password=never-echo-this&passwordConfirm=never-echo-this")).build();
        var response = client.send(request, HttpResponse.BodyHandlers.ofString());
        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("아이디는 영문"));
        assertFalse(response.body().contains("never-echo-this"));
    }
}

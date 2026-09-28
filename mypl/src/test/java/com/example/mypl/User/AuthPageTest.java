package com.example.mypl.User;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Value;
import java.net.URI;
import java.net.http.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthPageTest {
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

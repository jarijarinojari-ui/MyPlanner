package com.example.mypl.planner.focus;

import com.example.mypl.User.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties={"spring.datasource.url=jdbc:h2:mem:focus;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver","spring.datasource.username=sa","spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop","spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"})
@Transactional
class FocusServiceTest {
    @Autowired FocusService service;
    @Autowired UserRepository users;
    @Autowired FocusRepository records;
    private void user(String name) { var user=new UserEntity();user.setUsername(name);user.setName(name);user.setEmail(name+"@example.com");user.setPassword(name);users.saveAndFlush(user); }
    private FocusService.Start input(String mode) {return new FocusService.Start(UUID.randomUUID().toString(),"독서",mode,25);}
    @Test void startHeartbeatFinishIsIdempotentAndOwned() {
        user("alice");user("bob");var input=input("STOPWATCH");var first=service.start("alice",input);
        assertEquals(first.id(),service.start("alice",input).id());
        assertThrows(ResponseStatusException.class,()->service.start("alice",input("POMODORO")));
        assertThrows(ResponseStatusException.class,()->service.update("bob",first.id(),true,"finished"));
        assertNull(service.update("alice",first.id(),false,null).endedAt());
        var ended=service.update("alice",first.id(),true,"closed");assertNotNull(ended.endedAt());
        assertEquals(ended.endedAt(),service.update("alice",first.id(),true,"finished").endedAt());
        assertEquals(1,service.read("alice",first.startedAt().minusSeconds(1),first.startedAt().plusSeconds(60)).size());
        assertTrue(service.read("bob",first.startedAt().minusSeconds(1),first.startedAt().plusSeconds(60)).isEmpty());
    }
    @Test void staleTimerEndsAtLastHeartbeatAndAllowsNextStart() {
        user("stale");var entry=service.start("stale",input("STOPWATCH"));var record=records.findById(entry.id()).orElseThrow();
        record.startedAt=Instant.now().minusSeconds(300);record.lastSeenAt=record.startedAt.plusSeconds(120);
        service.start("stale",input("STOPWATCH"));assertEquals(record.lastSeenAt,record.endedAt);assertEquals("interrupted",record.reason);
    }
    @Test void pomodoroCapsAtTargetAndMidnightRangeFindsRecord() {
        var record=new FocusRecord();record.id="test";record.title="독서";record.mode="POMODORO";record.targetSeconds=1500;
        record.startedAt=Instant.parse("2026-10-03T23:50:00Z");record.lastSeenAt=record.startedAt.plusSeconds(1490);
        FocusService.settle(record,record.startedAt.plusSeconds(1505));
        assertEquals(record.startedAt.plusSeconds(1500),record.endedAt);assertEquals(1500,FocusService.entry(record).seconds());
        user("midnight");record.username="midnight";records.saveAndFlush(record);
        assertEquals(1,service.read("midnight",Instant.parse("2026-10-04T00:00:00Z"),Instant.parse("2026-10-05T00:00:00Z")).size());
    }
    @Test void recentTitlesAreDistinctNewestFirstAndPrivate() {
        user("recent");user("other");
        for(int i=0;i<12;i++) {
            var entry=service.start("recent",new FocusService.Start(UUID.randomUUID().toString(),"공부"+(i%10),"STOPWATCH",25));
            service.update("recent",entry.id(),true,"finished");
            var record=records.findById(entry.id()).orElseThrow();
            record.startedAt=Instant.parse("2026-10-01T00:00:00Z").plusSeconds(i);
        }
        records.flush();
        assertEquals(java.util.List.of("공부1","공부0","공부9","공부8","공부7","공부6","공부5","공부4"),service.recentTitles("recent"));
        assertTrue(service.recentTitles("other").isEmpty());
    }
    @Test void invalidInputCannotStart() {
        user("invalid");assertThrows(ResponseStatusException.class,()->service.start("invalid",new FocusService.Start(UUID.randomUUID().toString()," ","POMODORO",25)));
        assertThrows(ResponseStatusException.class,()->service.start("invalid",new FocusService.Start(UUID.randomUUID().toString(),"독서","POMODORO",0)));
    }
}

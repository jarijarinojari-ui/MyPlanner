package com.example.mypl.planner.focus;

import com.example.mypl.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.*;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional
public class FocusService {
    public record Start(String id, String title, String mode, int minutes) {}
    public record Entry(String id, String title, String mode, Instant startedAt, Instant endedAt,
                        long seconds, int targetSeconds, String reason) {}
    private final FocusRepository records;
    private final UserRepository users;
    private final Clock clock = Clock.systemUTC();

    @Transactional(readOnly=true)
    public List<String> recentTitles(String username) {
        return records.recentTitles(username, org.springframework.data.domain.PageRequest.of(0, 8));
    }
    private void lock(String username) {
        if (users.lockByUsername(username).isEmpty()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }
    public Entry start(String username, Start input) {
        lock(username);
        if (input == null || input.id()==null || !input.id().matches("[a-fA-F0-9-]{36}") || input.title()==null
                || input.title().isBlank() || input.title().codePointCount(0,input.title().length())>40
                || !Set.of("POMODORO","STOPWATCH").contains(input.mode()==null?"":input.mode())
                || input.minutes()<1 || input.minutes()>180) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        var existing = records.findById(input.id());
        if (existing.isPresent()) return entry(owned(username, input.id()));
        var now = clock.instant();
        var active = records.findByUsernameAndEndedAtIsNull(username);
        active.forEach(record -> settle(record,now));
        if (active.stream().anyMatch(record -> record.endedAt==null)) throw new ResponseStatusException(HttpStatus.CONFLICT,"A timer is already running");
        var record = new FocusRecord(); record.id=input.id(); record.username=username; record.title=input.title().strip();
        record.mode=input.mode(); record.startedAt=now; record.lastSeenAt=now;
        record.targetSeconds=input.mode().equals("POMODORO") ? input.minutes()*60 : Integer.MAX_VALUE;
        return entry(records.save(record));
    }
    public Entry update(String username, String id, boolean finish, String reason) {
        lock(username);
        var record=owned(username,id); var now=clock.instant(); settle(record,now);
        if (record.endedAt==null) {
            record.lastSeenAt=now;
            if (finish) { record.endedAt=now; record.reason="closed".equals(reason)?"closed":"finished"; }
        }
        return entry(record);
    }
    public List<Entry> read(String username, Instant from, Instant until) {
        if (from==null || until==null || !until.isAfter(from) || Duration.between(from,until).toDays()>9)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        lock(username);
        var now=clock.instant(); records.findByUsernameAndEndedAtIsNull(username).forEach(record -> settle(record,now));
        return records.inRange(username,from,until).stream().map(FocusService::entry).toList();
    }
    private FocusRecord owned(String username,String id) {
        return records.findById(id).filter(record -> record.username.equals(username))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    static void settle(FocusRecord record, Instant now) {
        if (record.endedAt!=null) return;
        Instant target=record.startedAt.plusSeconds(record.targetSeconds);
        // A closed/crashed page cannot accumulate time indefinitely. Last confirmed activity is authoritative.
        if (now.isAfter(record.lastSeenAt.plusSeconds(90))) {
            record.endedAt=record.lastSeenAt.isBefore(target)?record.lastSeenAt:target; record.reason="interrupted";
        } else if (!now.isBefore(target)) { record.endedAt=target; record.reason="completed"; }
    }
    static Entry entry(FocusRecord record) {
        var end=record.endedAt==null?record.lastSeenAt:record.endedAt;
        return new Entry(record.id,record.title,record.mode,record.startedAt,record.endedAt,
                Math.max(0,Duration.between(record.startedAt,end).getSeconds()),record.targetSeconds,record.reason);
    }
}

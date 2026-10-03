package com.example.mypl.planner.focus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.Instant;
import java.util.List;
public interface FocusRepository extends JpaRepository<FocusRecord,String> {
    @Query("select f.title from FocusRecord f where f.username=:username group by f.title order by max(f.startedAt) desc, f.title")
    List<String> recentTitles(String username, org.springframework.data.domain.Pageable pageable);
    List<FocusRecord> findByUsernameAndEndedAtIsNull(String username);
    @Query("select f from FocusRecord f where f.username=:username and f.startedAt < :until and (f.endedAt is null or f.endedAt > :from) order by f.startedAt")
    List<FocusRecord> inRange(String username, Instant from, Instant until);
}

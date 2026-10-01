# 자동 로그인과 첫 방문 언어

로그인 성공 시 Spring Security의 persistent remember-me 쿠키 `planner-login`을 기본 발급한다. 유효 기간은 30일이고 자동 로그인할 때 갱신된다. 현재 요청의 인증 처리는 기존 Spring Security 세션을 이용하되, 세션이 없어도 이 쿠키로 다시 인증한다. 비밀번호를 쿠키나 localStorage에 저장하지 않는다.

토큰은 `persistent_login` 테이블에 저장되므로 애플리케이션을 재시작해도 유지된다. 현재 `ddl-auto=update` 설정에서는 서버 재시작 시 테이블이 생성된다. 운영 환경에서 자동 스키마 변경을 사용하지 않는다면 이 엔티티에 대응하는 테이블과 username 인덱스를 먼저 생성해야 한다.

쿠키는 HttpOnly, SameSite=Lax로 발급되며 HTTPS 요청에서는 Secure가 적용된다. TLS를 프록시에서 종료하는 배포 환경은 신뢰하는 프록시의 전달 헤더를 Spring Boot가 처리하도록 설정해야 한다. 로그아웃은 쿠키를 만료시키고 해당 사용자의 자동 로그인 토큰을 폐기한다. 이미 다른 브라우저에서 활성화된 세션까지 종료하는 기능은 아니다.

첫 방문에는 브라우저가 https://api.country.is/ 로 국가를 조회한다. 이 서비스에는 방문자의 공개 IP가 전달된다. 앱은 IP를 저장하지 않고 감지한 언어만 `planner.detected-language`에 보관한다. 한국은 한국어, 일본은 일본어, 다른 국가는 영어를 사용한다. 국가 조회가 실패하거나 2.5초를 넘기면 브라우저 언어(지원하지 않는 언어는 영어)를 유지한다. 별도 API 키는 필요 없다.

사용자가 선택한 `planner.language`가 항상 최우선이다. 기존에 언어를 직접 선택한 브라우저에서는 국가 조회를 하지 않는다. 자동 감지 언어도 재방문 시 재사용한다.

검증:

- `./gradlew test --tests '*AuthPageTest' --tests '*SignupTest'` — H2 메모리 DB에서 세션 없는 쿠키 로그인, 토큰 갱신, 로그아웃 폐기, 만료·잘못된 쿠키, 기존 인증 화면 확인.
- `node --test src/test/js/appearance.test.cjs` — 국가별 선택, 수동 설정 우선, 감지 중 설정 변경, 재방문, 조회 실패 확인.

참고: https://docs.spring.io/spring-security/reference/7.0/servlet/authentication/rememberme.html · https://country.is/

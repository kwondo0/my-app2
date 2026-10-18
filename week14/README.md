# 14주차 — 소스코드 레벨 보안 실습 II & 풀스택 보안 거버넌스

> ✅ 이 주차의 `template/`은 13주차(안전한 버전)를 이어받아, 5종 취약점의 마지막 항목인 **Rate Limiting 부재**를 로그인 폼에 방어 코드로 추가하고, 응답에 **보안 헤더**를 붙였습니다. 12~14주차에 걸쳐 다룬 5종 취약점(XSS·시크릿 관리·NoSQL Injection·IDOR·Rate Limiting)이 이번 주로 모두 마무리됩니다.

## 학습 목표

- 무차별 대입 공격(Brute-force)과 크리덴셜 스터핑(Credential Stuffing)이 무엇이고, 왜 로그인 시도 횟수 제한이 필요한지 이해한다.
- 가장 단순한 형태의 Rate Limiting(고정 윈도우 카운터)을 직접 구현하고, 그 한계(단일 인스턴스 가정)를 이해한다.
- HTTP 보안 헤더(X-Content-Type-Options, X-Frame-Options, Referrer-Policy 등)가 각각 어떤 공격을 막는지 이해하고, `next.config.ts`로 전역 적용하는 방법을 익힌다.
- "혼자 완벽한 코드를 짜는 것"과 "팀이 놓치지 않는 구조를 만드는 것"의 차이 — 보안 체크리스트, 시크릿 스캐닝, 코드 리뷰 같은 거버넌스 도구를 소개받는다.
- 12~14주차에 다룬 5종 취약점을 표로 정리하며 전체 보안 유닛을 복습한다.

## template/ 폴더 안내 (13주차 대비 변경된 파일)

### 1. Rate Limiting (신규) — `lib/rateLimit.ts`, `lib/actions.ts`, `app/login/page.tsx`

`lib/rateLimit.ts`에 이메일별 시도 횟수를 세는 고정 윈도우(Fixed Window) 카운터를 추가했습니다. 1분에 5번까지만 로그인 시도를 허용합니다.

```ts
const WINDOW_MS = 60_000; // 1분
const MAX_ATTEMPTS = 5;

export function checkLoginRateLimit(identifier: string): RateLimitResult {
  // ... 이메일(identifier)별로 시도 횟수를 세고,
  // 윈도우 안에서 5번을 넘으면 { allowed: false, retryAfterSeconds } 반환
}
```

`lib/actions.ts`의 `loginAction`은 `signIn()`을 호출하기 **전에** 먼저 이 함수를 호출합니다. 제한에 걸리면 DB 조회나 `bcrypt.compare` 같은 비싼 작업을 아예 실행하지 않고 바로 `/login?error=ratelimited&retry=N`으로 리다이렉트합니다. `app/login/page.tsx`는 이 경우 "이메일 또는 비밀번호가 올바르지 않습니다"와는 다른, "로그인 시도가 너무 많습니다. N초 후 다시 시도해주세요" 메시지를 보여줍니다.

> ⚠️ `lib/rateLimit.ts` 상단 주석에 적었듯, 이 구현은 서버 프로세스 하나의 메모리(Map)에만 상태를 저장합니다. 다중 인스턴스 배포에서는 인스턴스마다 카운터가 따로 놀고, 서버가 재시작되면 초기화됩니다. 실무에서는 Redis 같은 공유 저장소나 API Gateway/CDN 레벨의 Rate Limiting을 함께 씁니다. 이번 예제는 "왜 필요한지, 어떤 모양인지"를 직접 만들어보는 것이 목적입니다.

### 2. 보안 헤더 (신규) — `next.config.ts`

`headers()` 설정으로 모든 응답에 다음 헤더를 붙였습니다.

| 헤더 | 값 | 막는 것 |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | 브라우저가 Content-Type을 무시하고 제멋대로 해석(MIME 스니핑)하는 것 |
| `X-Frame-Options` | `DENY` | 클릭재킹 — 다른 사이트가 우리 페이지를 `<iframe>`에 몰래 넣는 것 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | 다른 사이트로 이동할 때 민감할 수 있는 URL 정보가 과도하게 넘어가는 것 |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | 카메라·마이크·위치 정보를 아예 쓰지 않는다고 명시적으로 선언 |

Content-Security-Policy(CSP)는 라이브러리마다 필요한 예외가 많아 프로젝트별 튜닝이 필요하므로, 이번 예제에서는 개념만 소개하고 실제 구현은 범위 밖으로 뒀습니다(슬라이드 참고).

- 그 외 파일은 13주차와 동일합니다(XSS/시크릿 수정, 안전한 검색, IDOR 실습 코드는 변경 없음).

## 확인해보기

```bash
cd template
cp .env.local.example .env.local
# MONGODB_URI, AUTH_SECRET 채우기 (7주차 참고)
npm install
npm run dev
```

**Rate Limiting 확인**: `/login`에서 아무 이메일로나 비밀번호를 일부러 6번 연속 틀려보세요. 1~5번째는 평소와 같은 "이메일 또는 비밀번호가 올바르지 않습니다" 에러가 뜨고, 6번째부터는 "로그인 시도가 너무 많습니다. 60초 후 다시 시도해주세요"라는 다른 메시지가 뜨는지 확인하세요. (개발 서버에서 직접 만든 자동화 테스트로, 5번은 정상 에러 → 6번째는 즉시 `error=ratelimited&retry=60`으로 차단되는 것을 확인했습니다.)

**보안 헤더 확인**: 터미널에서 `curl -I http://localhost:3000/`을 실행하거나, 브라우저 개발자도구의 Network 탭에서 아무 응답이나 열어 Response Headers에 위 표의 헤더들이 붙어있는지 확인하세요.

> `npx tsc --noEmit`, `npx eslint .` 모두 (clean `.next` 상태에서) **경고 없이 통과**합니다. `next dev`를 실제로 부팅해 보안 헤더가 모든 응답에 붙는 것을 확인했고, 6회 연속 로그인 시도 시나리오(5회 정상 실패 → 6회째 즉시 차단)도 자동화된 브라우저 테스트로 재현·확인했습니다.

## 보안 메모

- **Rate Limiting은 "언제" 검사하느냐가 중요합니다**: `signIn()`(DB 조회 + bcrypt 비교)보다 먼저 검사해야, 제한에 걸린 요청이 서버 자원을 낭비하지 않습니다. 이 순서를 바꿔 DB 조회 후에 제한을 검사하면, 공격자가 여전히 서버에 부하를 줄 수 있습니다.
- **왜 이메일 기준으로 제한하는가**: IP 기준으로만 제한하면 같은 공유 IP(사내망, 카페 와이파이 등)를 쓰는 다른 사용자까지 함께 차단될 수 있고, 이메일 기준으로만 제한하면 공격자가 여러 IP로 우회할 수 있습니다. 실무에서는 보통 두 기준을 조합합니다(`lib/rateLimit.ts` 주석 참고).
- **보안 헤더는 "코드에 버그가 없어도" 필요합니다**: XSS나 IDOR처럼 코드 로직의 실수가 아니라, 브라우저가 기본적으로 허용하는 동작(iframe 삽입, MIME 재해석 등) 자체가 공격 표면이 됩니다. 헤더 설정은 이런 표면을 브라우저 차원에서 줄이는 것입니다.
- **거버넌스가 필요한 이유**: 지금까지 배운 개별 수정(XSS, 시크릿, Injection, IDOR, Rate Limiting)은 모두 "그 코드를 작성한 사람이 그 순간 알고 있었는가"에 의존합니다. 팀 규모가 커지면 이것만으로는 부족합니다 — PR 체크리스트, 자동 시크릿 스캐닝(gitleaks 등), 코드 리뷰 문화, 의존성 취약점 정기 점검처럼 "사람이 깜빡해도 시스템이 잡아주는" 구조가 필요합니다.

## 12~14주차 5종 취약점 총정리

| 취약점 | 원인 | 방어 위치 |
|---|---|---|
| XSS (저장형) | `dangerouslySetInnerHTML`로 사용자 입력을 이스케이프 없이 렌더링 | 13주차 — `app/notices/[id]/page.tsx` |
| 시크릿 관리 | 하드코딩된 폴백 시크릿 + 잊혀진 디버그 엔드포인트 | 13주차 — `auth.ts`의 `assertAuthSecret()` + 디버그 라우트 삭제 |
| NoSQL Injection | 사용자 입력을 검증·이스케이프 없이 Mongo 쿼리에 사용 | 13주차 — `lib/products.ts`의 `escapeRegExp()` (신규 기능부터 안전하게) |
| IDOR | "로그인했는지"만 확인하고 "그 사람 것인지"를 확인하지 않음 | 11주차 도입, 13주차 실습 — `app/orders/[id]/page.tsx`의 소유권 검사 |
| Rate Limiting 부재 | 로그인 시도 횟수에 제한이 없어 무차별 대입 공격 가능 | 14주차 — `lib/rateLimit.ts` + 보안 헤더 |

## 이번 주 체크리스트 (과제 #11)

- [ ] 로그인 6회 연속 시도해보고 6번째에 차단되는지 확인
- [ ] `curl -I`나 개발자도구로 보안 헤더(X-Content-Type-Options, X-Frame-Options, Referrer-Policy) 확인
- [ ] 12~14주차 5종 취약점을 표로 정리 (취약점 이름 · 원인 파일 · 수정 방법)
- [ ] gitleaks(또는 유사 도구)로 본인 레포를 스캔해보고 결과 기록
- [ ] 레포에 push + 5종 취약점 정리표 (`.env.local` 제외) → submissions-2026에 repo_url · commit_sha · deploy_url PR 제출

## 슬라이드

`slides/week14.pptx`

## 이전 / 다음 주

- 이전: [week13](../week13/README.md)
- 다음: [week15](../week15/README.md)

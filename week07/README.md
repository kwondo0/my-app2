# 7주차 — 인증 기초

`template/`은 6주차 공지사항 게시판에 Auth.js(NextAuth) v5로 회원가입/로그인/로그아웃을 추가한 것입니다.

## 학습 목표

- 인증(authentication, "누구인가")과 인가(authorization, "무엇을 할 수 있는가")를 구분한다. 이번 주는 인증만 다루고, 인가(로그인해야 글쓰기 가능 등)는 9주차에서 다룹니다.
- bcrypt로 비밀번호를 해싱해 저장한다 — 원본 비밀번호는 서버 어디에도 남기지 않는다.
- Auth.js의 Credentials Provider로 우리 DB(User 컬렉션)를 직접 조회하는 로그인을 구현한다.
- 로그인 상태를 서명된 JWT 세션 쿠키로 관리하는 방식을 이해한다.
- `<form action={...}>` 패턴이 회원가입/로그인/로그아웃에도 동일하게 적용됨을 확인한다.
- async Server Component(`SiteHeader`)에서 `auth()`로 세션을 직접 읽어, 클라이언트 자바스크립트 없이 로그인 상태에 따라 다른 화면을 그린다.

## template/ 폴더 안내 (6주차 대비 추가된 파일)

- `auth.ts` — Auth.js v5 설정 (프로젝트 루트, Credentials Provider, JWT 세션)
- `models/User.ts` — Mongoose 스키마 (`name`, `email`, `passwordHash`)
- `lib/users.ts` — `createUser()` — bcrypt로 해싱 후 User 컬렉션에 저장
- `app/api/auth/[...nextauth]/route.ts` — Auth.js가 쓰는 모든 인증 관련 요청을 처리하는 Route Handler
- `app/login/page.tsx` — 로그인 폼 (`loginAction`, 실패 시 `/login?error=1`로 안내)
- `app/register/page.tsx` — 회원가입 폼 (`registerAction`, 가입 즉시 로그인까지 이어짐)
- `lib/actions.ts` — `registerAction` / `loginAction` / `logoutAction` 추가
- `components/SiteHeader.tsx` — async Server Component로 변경, `auth()`로 세션을 읽어 로그인/로그아웃 버튼을 전환
- `.env.local.example` — `AUTH_SECRET` 항목 추가

### 실행해보기

```bash
cd template
cp .env.local.example .env.local
# MONGODB_URI를 본인 클러스터로 채우고,
# AUTH_SECRET은 아래 명령으로 자동 생성
npx auth secret
npm install
npm run dev
# http://localhost:3000/register 에서 가입 → 자동 로그인 → 헤더에서 로그아웃까지 확인
```

> `npx tsc --noEmit`, `npx eslint .` 모두 (clean `.next` 상태에서) 통과를 확인했습니다.
> 이 레포에는 실제 MongoDB 클러스터가 연결돼 있지 않아 이 샌드박스 자체에서 로그인 성공까지는
> 확인할 수 없었지만, `next dev`를 실제로 부팅해 `/`, `/login`, `/register`, `/api/auth/session`이
> 모두 정상 응답(200)하고 로그인/회원가입 폼의 입력 필드가 올바르게 렌더링되는 것까지 확인했습니다.
> `npm run build`는 네트워크 제한(Google Fonts) 때문에만 실패할 수 있습니다.

## 보안 메모

- 비밀번호는 `bcrypt.hash()`로 해싱한 `passwordHash`만 저장합니다. DB가 유출되어도 원본 비밀번호는 알 수 없습니다 (`bcrypt.compare()`로 "같은지"만 검증하는 원리).
- `AUTH_SECRET`은 세션 쿠키(JWT)에 서명하는 키입니다 — 유출되면 누구나 로그인 세션을 위조할 수 있으므로 `MONGODB_URI`와 마찬가지로 `.env.local`에만 두고 절대 커밋하지 않습니다.
- 지금은 로그인 여부와 무관하게 누구나 글쓰기가 가능합니다. "로그인한 사람만 글을 쓸 수 있게" 막는 것은 인가(authorization)의 영역이며, 9주차에서 다룹니다.

## 이번 주 체크리스트 (과제 #5)

- [ ] 본인 배포 환경에서 회원가입 → 로그인 → 로그아웃 전체 흐름 확인
- [ ] `npx auth secret`으로 `AUTH_SECRET` 발급 후 `.env.local`에 반영
- [ ] 일부러 틀린 비밀번호로 로그인 시도해 `/login?error=1` 처리가 되는지 확인
- [ ] 레포에 push (`.env.local` 제외) → Vercel 배포 → submissions-2026에 repo_url · commit_sha · deploy_url PR 제출

## 슬라이드

`slides/week07.pptx`

## 이전 / 다음 주

- 이전: [week06](../week06/README.md)
- 다음: [week08](../week08/README.md)

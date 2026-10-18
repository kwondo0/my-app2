# 9주차 — 인증 완성 & 권한(RBAC)

`template/`은 7주차에서 만든 로그인/회원가입에, 실제로 "권한"을 붙인 버전입니다. 7주차까지는 로그인 여부와 무관하게 누구나 글을 쓸 수 있었습니다 — 이번 주에 그 구멍을 막습니다.

## 학습 목표

- 인가(authorization)를 두 층으로 구현한다: 라우트 단위 차단(`proxy.ts`)과 Server Action 내부 재확인. 이를 **심층 방어(Defense in Depth)**라고 부르며, 한 겹이 뚫려도 다음 겹이 막아야 한다는 원칙을 이해한다.
- role(`user`/`admin`) 기반 최소 RBAC를 구현한다.
- role만으로는 부족한 이유(소유권 기반 권한)를 이해한다 — "이 글의 주인이 나인가"는 role과는 다른 축의 질문이다.
- **화면에서 버튼을 숨기는 것은 보안이 아니다**를 실습으로 확인한다 — 진짜 방어는 서버 코드 안에 있어야 한다.
- (부록) Next.js 미들웨어가 Edge Runtime에서 실행되기 때문에 겪은 실제 버그와 그 해결 과정을 통해, Node.js 전용 API(bcrypt, mongoose)와 Edge Runtime의 제약을 이해한다.

## template/ 폴더 안내 (7주차 대비 추가/변경된 파일)

- `types/next-auth.d.ts` (신규) — `Session`/`User`/`JWT`에 `id`, `role` 필드를 타입으로 추가(모듈 보강)
- `models/User.ts` — `role: "user" | "admin"` 필드 추가 (기본값 `"user"`). 셀프서비스로 admin이 되는 UI는 일부러 만들지 않았습니다 — 그 자체가 공격 표면이기 때문입니다. admin 승격은 MongoDB Atlas에서 직접 문서를 수정하는 방식으로만 가능합니다.
- `auth.config.ts` (신규) — Edge Runtime에서도 안전하게 쓸 수 있는 가벼운 설정. `providers`는 비워두고, 라우트 보호 여부만 판단하는 `authorized` 콜백만 둡니다.
- `auth.ts` (변경) — `auth.config.ts`를 확장해 실제 로그인 로직(Credentials Provider)을 더한 완전한 버전. `jwt`/`session` 콜백에서 `role`을 토큰과 세션에 옮겨 담습니다. Node.js 런타임(Server Component/Action/Route Handler)에서만 import합니다.
- `proxy.ts` (신규, `middleware.ts` 대체) — `auth.config.ts`만으로 구성된 가벼운 `NextAuth` 인스턴스를 만들어, `/notices/new` 진입 자체를 로그인 여부로 차단합니다. Next.js 16부터 파일명이 `middleware.ts`에서 `proxy.ts`로 바뀌었습니다(기능은 동일).
- `models/Notice.ts` — 자유 텍스트였던 `author`를 `authorId`(User 참조)와 `authorName`으로 교체
- `lib/notices.ts` — `Notice` 타입을 `authorId`/`authorName`에 맞게 수정, `deleteNotice()` 추가, 자동 시드 로직 제거(빈 상태 UI로 대체)
- `lib/actions.ts` — `createNoticeAction`이 로그인 여부를 서버에서 다시 확인하고 세션에서 작성자 정보를 가져옴(폼 입력이 아님). `deleteNoticeAction` 신규 추가 — 작성자 본인이거나 admin일 때만 삭제 허용
- `app/notices/new/page.tsx` — 비로그인 시 `/login`으로 리다이렉트(라우트 차단과는 별개의 방어), 작성자 입력란 제거하고 세션의 이름을 읽기 전용으로 표시
- `app/notices/[id]/page.tsx` — 삭제 버튼을 `canDelete`(본인 또는 admin)일 때만 렌더링. 이 UI 분기는 진짜 방어가 아니라는 점을 코드 주석으로 명시
- `app/notices/page.tsx` — 글이 없을 때 안내 문구로 대체(자동 시드 제거)
- `components/SiteHeader.tsx` — admin 로그인 시 "관리자" 배지 표시

### 실행해보기

```bash
cd template
cp .env.local.example .env.local
# MONGODB_URI, AUTH_SECRET 채우기 (7주차 참고)
npm install
npm run dev
# 로그아웃 상태로 /notices/new 접속 → /login으로 자동 이동하는지 확인
# 로그인 후 글 작성 → 목록에 내 이름으로 표시되는지 확인
# 내 글 상세 페이지에서 "삭제" 버튼이 보이는지, 남의 글에서는 안 보이는지 확인
```

> `npx tsc --noEmit`, `npx eslint .` 모두 (clean `.next` 상태에서) 통과를 확인했습니다.
> 추가로 `next dev`를 실제로 부팅해 확인했습니다: 로그아웃 상태로 `GET /notices/new` 요청 시
> `307`로 `/login?callbackUrl=...`로 리다이렉트되고, `/`, `/login`, `/register`, `/notices`,
> `/api/auth/session`은 모두 정상 응답(200)했습니다. Edge Runtime 에러나 배포 경고(deprecation
> warning)도 없었습니다. 이 샌드박스에는 실제 MongoDB 클러스터가 없어 로그인 성공 이후의 전체
> 흐름(글쓰기 → 삭제 권한 분기)까지는 직접 확인하지 못했으며, 이 부분은 본인 클러스터 연결 후
> 체크리스트로 확인해야 합니다.

## 실습 중 발견한 진짜 버그: Edge Runtime

`middleware.ts`(현재는 `proxy.ts`)에서 `@/auth`(Credentials Provider가 포함된 전체 설정)를 그대로 import했더니 `GET /notices/new`가 `500`을 반환했습니다. 서버 로그:

```
⨯ Error: A Node.js API is used (process.getBuiltinModule) which is not supported in the Edge Runtime.
```

**원인**: Next.js의 미들웨어(현재 `proxy.ts`)는 기본적으로 Edge Runtime에서 실행됩니다. `auth.ts`가 import하는 `bcryptjs`, `mongoose`는 Node.js 전용 API를 쓰기 때문에 Edge Runtime에서 아예 실행할 수 없습니다.

**해결**: 설정을 둘로 쪼갰습니다.

- `auth.config.ts` — Edge에서도 안전한 최소 설정(providers 없음, 라우트 판단 콜백만)
- `auth.ts` — `auth.config.ts`를 확장해 실제 로그인 로직을 더한 전체 설정 (Node.js 런타임 전용)

`proxy.ts`는 `auth.config.ts`만 가지고 별도의 가벼운 `NextAuth` 인스턴스를 만들어 씁니다. 이 문제는 정적 타입 검사(`tsc`)나 린트로는 잡히지 않고, 실제로 `next dev`를 부팅해봐야 드러나는 종류의 버그였습니다 — 6주차부터 이어온 "서버를 실제로 띄워서 확인한다" 검증 절차가 이번에도 실제 버그를 잡아냈습니다.

## 보안 메모

- **인증(누구인가)과 인가(무엇을 할 수 있는가)는 다릅니다.** 7주차는 인증만, 9주차는 그 위에 인가를 쌓았습니다.
- **심층 방어**: `proxy.ts`의 라우트 차단만 믿지 않고, `deleteNoticeAction`/`createNoticeAction` 내부에서도 세션과 소유권을 다시 확인합니다. `matcher` 설정 실수나 예외적인 경로로 미들웨어가 우회될 가능성은 항상 있습니다.
- **role과 소유권은 다른 축입니다.** "관리자인가"(role)와 "이 글의 주인인가"(소유권)를 둘 다 확인해야 "본인 글 또는 admin만 삭제 가능"이 완성됩니다.
- **버튼을 숨기는 것은 보안이 아닙니다.** 삭제 버튼을 안 보이게 하는 것은 UX일 뿐, 브라우저 개발자 도구로 요청을 직접 조작하는 공격자를 막지 못합니다. 진짜 방어는 `deleteNoticeAction`의 서버 쪽 검사입니다. 이 문장은 12~14주차 OWASP 실습(특히 IDOR)의 예고편입니다.

## 이번 주 체크리스트 (과제 #6)

- [ ] 로그아웃 상태로 `/notices/new` 직접 접속 → 로그인 페이지로 자동 리다이렉트되는지 확인
- [ ] 본인 글 삭제 + 남의 글 삭제 시도 → 본인 글만 지워지고, 다른 계정 글은 삭제 버튼조차 안 보이는지 확인
- [ ] MongoDB Atlas에서 본인 계정 하나를 `role: "admin"`으로 직접 변경 → 모든 글 삭제 가능한지 확인
- [ ] 레포에 push (`.env.local` 제외) → Vercel 배포 → submissions-2026에 repo_url · commit_sha · deploy_url PR 제출

## 슬라이드

`slides/week09.pptx`

## 이전 / 다음 주

- 이전: [week08](../week08/README.md)
- 다음: [week10](../week10/README.md)

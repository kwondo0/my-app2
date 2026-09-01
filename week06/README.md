# 6주차 — MongoDB 연동 & 실제 CRUD

`template/`은 5주차 공지사항 게시판의 데이터 계층(`lib/notices.ts`)을 실제 MongoDB(Atlas) + Mongoose 조회로 교체한 것입니다.

## 학습 목표

- MongoDB Atlas 무료(M0) 클러스터를 생성하고 접속 문자열(URI)을 발급받는다.
- 접속 정보를 코드가 아닌 `.env.local` 환경변수로만 관리한다 — 시크릿 관리의 첫 실습.
- Next.js의 hot-reload 환경에서 DB 연결이 계속 쌓이지 않도록 캐싱하는 표준 패턴을 이해한다.
- Mongoose 스키마(`models/Notice.ts`)로 데이터 구조를 명시적으로 정의한다.
- `error.tsx`로 DB 장애 시에도 사용자에게 내부 정보를 노출하지 않고 안전하게 처리한다.

## 데이터 계층만 교체, 화면 코드는 그대로

5주차의 `lib/notices.ts`는 in-memory 배열이었지만, 이번 주는 내부 구현만 MongoDB 조회로 바뀌었습니다.
`Notice` 타입과 `getNotices` / `getNotice` / `createNotice` 함수 시그니처는 동일하게 유지했기 때문에
`app/notices/*.tsx`, `lib/actions.ts`는 **한 줄도 수정하지 않았습니다.**

## template/ 폴더 안내 (5주차 대비 추가/변경된 파일)

- `lib/mongodb.ts` — Mongoose 연결 캐싱 헬퍼(`connectDB`). 연결 실패 시 재시도 가능하도록 캐시를 정리합니다.
- `models/Notice.ts` — Mongoose 스키마/모델 (`title`, `author`, `content` + `timestamps: true`로 `createdAt`/`updatedAt` 자동 생성)
- `lib/notices.ts` — 내부 구현을 MongoDB 조회로 교체 (함수 시그니처는 5주차와 동일). 컬렉션이 비어있을 때만 예시 데이터 3개를 자동 시드합니다.
- `app/notices/error.tsx` — DB 연결 실패 등 에러 발생 시 안전한 문구만 보여주는 에러 바운더리
- `.env.local.example` — `.env.local`로 복사해서 사용할 환경변수 템플릿 (`MONGODB_URI`)

### 실행해보기

```bash
cd template
cp .env.local.example .env.local
# .env.local을 열어 본인의 MongoDB Atlas 접속 문자열로 채우기
npm install
npm run dev
# http://localhost:3000/notices 접속
```

> `npx tsc --noEmit`, `npx eslint .` 모두 (clean `.next` 상태에서) 통과를 확인했습니다.
> 이 레포 자체에는 실제 MongoDB 클러스터가 연결돼 있지 않으므로, 이 샌드박스에서는 `/notices` 접속 시
> DB 연결 오류가 나는 것이 정상입니다 — `error.tsx`가 이 상황을 안전하게 처리하는지까지 확인했습니다.
> `npm run build`는 네트워크 제한(Google Fonts) 때문에만 실패할 수 있습니다 (MongoDB/Mongoose 관련 오류 아님).

## 보안 메모

- `.env.local`은 `.gitignore`에 포함되어 있어 Git에 올라가지 않습니다. **절대 직접 커밋하지 마세요.**
- `.env.local.example`처럼 실제 값이 없는 템플릿 파일만 레포에 남겨 팀원이 참고하게 합니다.
- Vercel에 배포하면 서버의 IP가 계속 바뀌므로 MongoDB Atlas의 Network Access에 `0.0.0.0/0`을 등록하는 경우가 많습니다. 이때는 네트워크가 아니라 계정/비밀번호가 유일한 방어선이 되므로 강력한 비밀번호를 사용하세요.

## 이번 주 체크리스트 (과제 #4)

- [ ] 본인 명의로 MongoDB Atlas 무료 클러스터 생성 + 접속 문자열 발급
- [ ] `.env.local` 설정 후 로컬에서 게시판이 실제로 동작하는지 확인
- [ ] 5주차 과제에서 추가한 필드를 `models/Notice.ts` 스키마에도 반영
- [ ] Organization의 `assignments-<학번>/week06/` 폴더에 push (`.env.local`은 절대 포함하지 말 것) 후 Vercel 배포 링크 제출

## 슬라이드

`slides/week06.pptx`

## 이전 / 다음 주

- 이전: [week05](../week05/README.md)
- 다음: [week07](../week07/README.md)

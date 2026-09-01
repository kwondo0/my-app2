# 4주차 — Next.js 핵심 기능 심화

`template/`은 3주차 프로젝트에 라우팅·데이터 페칭·Server Action·Route Handler·shadcn/ui를 이어서 추가한 것입니다.

## 학습 목표

- 동적 라우팅(`app/products/[id]`)으로 하나의 파일이 여러 URL을 처리하는 방식을 이해한다.
- Server Component에서 `await`로 데이터를 바로 가져오고, `loading.tsx`로 자동 로딩 UI를 구성한다.
- Server Action(`"use server"`)으로 클라이언트에서 서버 로직을 함수처럼 호출한다.
- Route Handler(`app/api/.../route.ts`)로 JSON을 응답하는 API 엔드포인트를 만든다.
- shadcn/ui 컴포넌트(Button)를 프로젝트에 들여와 재사용한다.

## template/ 폴더 안내 (3주차 대비 추가된 파일)

- `lib/products.ts` — 임시 데이터 + 지연(delay)이 있는 비동기 조회 함수 (6주차에 MongoDB로 교체 예정)
- `app/products/page.tsx` — 상품 목록 (Server Component, `await getProducts()`)
- `app/products/loading.tsx` — 목록을 기다리는 동안 자동으로 보이는 스켈레톤 UI
- `app/products/[id]/page.tsx` — 동적 라우팅 상세 페이지, 없는 id는 `notFound()`
- `lib/actions.ts` — Server Action `likeProductAction`
- `components/LikeButton.tsx` — Server Action을 호출하는 Client Component (`useTransition`)
- `app/api/hello/route.ts` — 간단한 Route Handler 예시
- `components.json`, `lib/utils.ts`, `components/ui/button.tsx` — shadcn/ui 기본 설정 + Button 컴포넌트

### 실행해보기

```bash
cd template
npm install
npm run dev
# http://localhost:3000 접속 → /products, /api/hello 도 함께 확인
```

> 3주차와 마찬가지로 `npx tsc --noEmit`, `npx eslint .` 모두 통과를 확인했습니다.
> `npm run build`는 이 샌드박스의 네트워크 제한(Google Fonts) 때문에만 실패할 수 있습니다.

## 이번 주 체크리스트 (과제 #2)

- [ ] 지난주 프로젝트에 `/products` 목록 + 상세 페이지 추가
- [ ] 새 항목을 추가하는 기능 하나 직접 구현 (폼 + Server Action, DB 연동은 6주차에서)
- [ ] `loading.tsx`가 실제로 보이는지 확인 (delay를 늘려서 테스트해도 좋음)
- [ ] shadcn/ui Button을 하나 이상 사용해보기
- [ ] 레포에 push (`assignments-<학번>` 권장) → Vercel 배포 → submissions-2026에 repo_url · commit_sha · deploy_url PR 제출

## 슬라이드

`slides/week04.pptx`

## 이전 / 다음 주

- 이전: [week03](../week03/README.md)
- 다음: [week05](../week05/README.md)

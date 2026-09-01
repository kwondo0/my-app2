# 3주차 — Next.js 템플릿 프로젝트 설치·구조 이해

이번 주부터 실제 코드를 다룹니다. `template/` 폴더에 `create-next-app`으로 만든
Next.js 16 App Router 템플릿이 들어있습니다. 직접 설치해보고, 이 템플릿과 비교해보세요.

## 학습 목표

- `create-next-app`으로 Next.js 16 + TypeScript + Tailwind v4 프로젝트를 직접 설치한다.
- `app/` 폴더 구조와 File-based Routing 규칙(폴더 → URL)을 이해한다.
- Server Component가 기본값이고, `"use client"`로 Client Component 경계를 표시한다는 것을 이해한다.
- GitHub push → Vercel 자동 배포까지 한 사이클을 완주한다.

## template/ 폴더 안내

`template/`은 아래 명령으로 만든 결과물에 학습용 주석과 예제 두 가지를 추가한 것입니다.

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

- `app/page.tsx` — 홈페이지 (Server Component). 아래 `Counter`를 불러와 보여줍니다.
- `app/about/page.tsx` — File-based Routing 예시로 추가한 두 번째 페이지 (`/about`).
- `components/Counter.tsx` — `"use client"` + `useState`를 쓰는 Client Component 예시.
- `app/globals.css` — Tailwind v4의 CSS-first 설정(`@theme`) 예시.

### 실행해보기

```bash
cd template
npm install
npm run dev
# http://localhost:3000 접속
```

> 이 레포(강의용 샌드박스)에서는 네트워크 제한으로 Google Fonts(next/font/google)를
> 가져오지 못해 `npm run build`가 실패할 수 있습니다. 일반 개발 환경(학생 PC)에서는
> 인터넷 연결만 있으면 정상적으로 빌드됩니다. `npx tsc --noEmit`과 `npx eslint .`는
> 이 레포에서도 모두 통과하는 것을 확인했습니다.
>
> 참고: `app/layout.tsx`의 `children` 타입은 `next dev`/`next build`를 한 번 실행해야
> 생성되는 `LayoutProps<"/">` 대신, 처음부터 바로 타입 체크가 되도록 `ReactNode`로 명시했습니다.

## 이번 주 체크리스트 (과제 #1)

- [ ] `create-next-app`으로 나만의 프로젝트 생성 (이름은 자유, 옵션은 위와 동일하게)
- [ ] `app/about/page.tsx`를 직접 만들어 `/about` 라우트 추가
- [ ] `useState`를 쓰는 Client Component를 하나 직접 작성 (Counter 참고 가능, 그대로 복붙 금지)
- [ ] Organization의 `assignments-<학번>/week03/` 폴더에 push
- [ ] Vercel에 배포하고 배포 URL을 과제 제출란에 함께 제출

## 슬라이드

`slides/week03.pptx`

## 이전 / 다음 주

- 이전: [week02](../week02/README.md)
- 다음: [week04](../week04/README.md)

# 웹서버보안프로그래밍 — 강의 소스코드 레포

중부대학교 정보보호학과 2학년 2학기 「웹서버보안프로그래밍」 강의의 실습 소스코드 레포입니다.
슬라이드는 별도로 배포되며, 예제 코드는 이 레포에서 **주차별 폴더**로 관리합니다.

## 사용 스택

- Node.js 24 LTS
- Next.js 16 (App Router) · React 19.2 · TypeScript 5.9
- Tailwind CSS v4 (CSS-first `@theme` 설정) · shadcn/ui
- MongoDB Atlas · Mongoose
- Auth.js (NextAuth) v5-beta
- 배포: Vercel

## 폴더 구조

```
websecprog/
├─ week01/   1주차 — 강의 개요 & 풀스택 웹의 발전방향
├─ week02/   2주차 — 주요 테크스택 심층 소개
├─ week03/   3주차 — Next.js 템플릿 프로젝트 설치·구조 이해
├─ week04/   4주차 — Next.js 핵심 기능 심화
├─ week05/   5주차 — 쉬운 예제 프로젝트
├─ week06/   6주차 — MongoDB 연동 & 실제 CRUD
├─ week07/   7주차 — 인증 기초 & 중간난이도 예제 시작
├─ week08/   8주차 — 중간고사 (팀프로젝트 기획서 발표)
├─ week09/   9주차 — 인증 예제 완성 & 권한(RBAC) 기초
├─ week10/  10주차 — 고급 예제 I: 쇼핑몰 (레퍼런스 구현, 착수)
├─ week11/  11주차 — 고급 예제 I 완성 + SNS 예제 과제
├─ week12/  12주차 — OWASP 웹보안 개론
├─ week13/  13주차 — 소스코드 레벨 보안 실습 I
├─ week14/  14주차 — 소스코드 레벨 보안 실습 II & 풀스택 보안 거버넌스
└─ week15/  15주차 — 최종 발표 & 총정리 (기말고사)
```

각 주차 폴더의 `README.md`에 그 주차의 학습 목표, 실행 방법, (있다면) 배포 링크와 슬라이드 링크를 정리합니다.
아직 실습이 진행되지 않은 주차는 🚧 로 표시되어 있으며, 해당 주차가 되면 실제 코드로 채워집니다.

## 진행 현황

| 주차 | 주제 | 상태 |
|---|---|---|
| 01 | 강의 개요 & 풀스택 웹의 발전방향 | ✅ |
| 02 | 주요 테크스택 심층 소개 | ✅ |
| 03 | Next.js 템플릿 설치·구조 이해 | ✅ |
| 04 | Next.js 핵심 기능 심화 | ✅ |
| 05 | 쉬운 예제 프로젝트 | ✅ |
| 06 | MongoDB 연동 & 실제 CRUD | ✅ |
| 07 | 인증 기초 & 중간난이도 예제 시작 | ✅ |
| 08 | 중간고사 | ✅ |
| 09 | 인증 예제 완성 & RBAC | ✅ |
| 10 | 고급 예제 I: 쇼핑몰 (착수) | ✅ |
| 11 | 고급 예제 I 완성 + SNS 과제 | ✅ |
| 12 | OWASP 웹보안 개론 | ✅ |
| 13 | 소스코드 레벨 보안 실습 I | ✅ |
| 14 | 소스코드 레벨 보안 실습 II | ✅ |
| 15 | 최종 발표 & 총정리 | ✅ |

## 공통 개발환경

- Node.js 24 LTS 설치: https://nodejs.org/
- Git / GitHub 계정 준비
- MongoDB Atlas 무료 클러스터 생성: https://www.mongodb.com/atlas
- 에디터: VSCode 권장 (ESLint, Prettier, Tailwind CSS IntelliSense 확장 추천)

## 과제/팀프로젝트 제출

과제와 팀프로젝트는 이 레포가 아니라 각자 GitHub Organization 아래의 개인/팀 레포(`assignments-<학번>`, `team-<팀명>`, `portfolio-<학번>`)에 제출합니다.
이 레포는 강의용 레퍼런스 코드만 담습니다.

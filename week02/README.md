# 2주차 — 주요 테크스택 심층 소개 & 개발환경 구축

이번 주도 코드 실습보다는 개발환경 준비가 중심입니다. 슬라이드(`slides/week02.pptx`)에서 각 기술을 대안과 비교하며 "왜 이 조합인가"를 다룹니다.

## 학습 목표

- React 19 · Next.js 16 · Tailwind v4 · MongoDB/Mongoose · Auth.js v5 · Vercel, 여섯 가지 기술을 각각 왜 선택했는지 대안 기술과 비교하며 이해한다.
- Clerk 같은 관리형 인증 서비스도 있다는 것을 알아두되, 이 강의의 실습에는 Auth.js를 사용하는 이유를 이해한다.
- 개발환경(Node.js 24 LTS, Git, VSCode 확장)을 구축하고 정상 동작을 확인한다.
- MongoDB Atlas 무료 클러스터를 생성하고 연결 문자열을 발급받는다.

## 이번 주 체크리스트

- [ ] `node -v` → v24.x.x, `npm -v`, `git --version` 확인
- [ ] VSCode 확장 설치: ESLint, Prettier, Tailwind CSS IntelliSense, MongoDB for VS Code
- [ ] MongoDB Atlas 계정 생성 → M0(무료) 클러스터 생성 → Network Access 등록 → Database User 생성 → 연결 문자열(Connection String) 발급
- [ ] 발급받은 연결 문자열은 코드에 직접 쓰지 않고 `.env.local`에만 보관 (3주차 이후 실습에서 바로 사용)
- [ ] GitHub Organization 초대를 아직 수락하지 않았다면 완료

## 참고

- Node.js 24 LTS: https://nodejs.org/
- MongoDB Atlas: https://www.mongodb.com/atlas
- 이번 주는 아직 프로젝트 코드가 없습니다 — 3주차부터 `create-next-app`으로 실제 템플릿 프로젝트가 시작됩니다.

## 슬라이드

`slides/week02.pptx`

## 이전 / 다음 주

- 이전: [week01](../week01/README.md)
- 다음: [week03](../week03/README.md)

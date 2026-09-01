# 13주차 — 소스코드 레벨 보안 실습 I: XSS·시크릿 수정 + NoSQL Injection 방어 + IDOR 실습

> ✅ **이 주차의 `template/`은 안전한 버전(after)입니다.** 12주차에서 일부러 남겨둔 저장형 XSS와 시크릿 노출을 직접 고치고, 새로 추가한 상품 검색 기능은 NoSQL Injection을 처음부터 막도록 안전하게 만들었습니다. 12주차와 달리 이 버전은 로컬에서 안전하게 확인해도 됩니다.

## 학습 목표

- 저장형 XSS를 실제로 고쳐보며, `dangerouslySetInnerHTML`이 애초에 필요 없었다는 것("줄바꿈 표시"는 `whitespace-pre-wrap`만으로 충분)을 확인한다.
- 하드코딩된 폴백 시크릿을 "값이 없으면 즉시, 명확하게 실패한다(fail fast)"는 패턴으로 바꾸고, 왜 이 방식이 더 안전한지 이해한다.
- NoSQL Injection이 무엇이고(SQL Injection의 MongoDB 버전), 사용자 입력을 안전하게 검증·이스케이프하는 방법을 새 기능(상품 검색)에 처음부터 적용해본다.
- IDOR(Insecure Direct Object Reference)를 직접 재현해보며, "인증"과 "인가"가 왜 다른 개념인지 체감한다.

## template/ 폴더 안내 (12주차 대비 변경된 파일)

### 1. 저장형 XSS 수정 — `app/notices/[id]/page.tsx`

12주차의 `dangerouslySetInnerHTML={{ __html: notice.content.replace(/\n/g, "<br>") }}`를 제거하고, 원래도 충분했던 안전한 렌더링으로 되돌렸습니다.

```tsx
// before (12주차, 취약)
<div dangerouslySetInnerHTML={{ __html: notice.content.replace(/\n/g, "<br>") }} />

// after (13주차, 수정)
<p className="whitespace-pre-wrap leading-7 ...">{notice.content}</p>
```

`whitespace-pre-wrap` CSS 속성이 줄바꿈(`\n`)을 그대로 화면에 보여주기 때문에, HTML을 직접 주입할 이유가 처음부터 없었습니다. `{notice.content}`처럼 중괄호로 렌더링하면 React가 자동으로 HTML 특수문자를 이스케이프합니다.

### 2. 시크릿 노출 수정 — `auth.ts`, `app/api/debug/env/route.ts`

`auth.ts`에 `assertAuthSecret()` 함수를 추가해, 환경변수가 없으면 하드코딩된 기본값을 쓰는 대신 앱 시작 시점에 즉시 에러를 던지도록 바꿨습니다.

```ts
function assertAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET 환경변수가 없습니다. `.env.local.example`을 참고해 `.env.local`을 만들고, " +
        "`npx auth secret`으로 값을 채워주세요."
    );
  }
  return secret;
}
const authSecret = assertAuthSecret();
// ... NextAuth({ secret: authSecret, ... })
```

그리고 인증 없이 환경변수를 그대로 반환하던 `app/api/debug/env/route.ts`는 통째로 **삭제**했습니다.

### 3. NoSQL Injection을 막는 안전한 검색 기능 (신규) — `lib/products.ts`, `app/products/page.tsx`

12주차처럼 취약한 코드를 만들었다가 나중에 고치는 대신, **처음부터 안전하게** 새 기능을 추가했습니다. `lib/products.ts`에 `searchProducts()`와 `escapeRegExp()`를 추가하고, `app/products/page.tsx`에 검색 폼(`?q=`)을 연결했습니다.

```ts
// ❌ 위험한 방법 (만들지 않았습니다) — 사용자 입력을 그대로 정규식으로 사용
ProductModel.find({ name: { $regex: rawQuery } });

// ✅ 실제로 만든 방법 — 타입 검증 후 정규식 특수문자를 이스케이프
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const safePattern = escapeRegExp(rawQuery.trim());
ProductModel.find({ name: { $regex: safePattern, $options: "i" } });
```

`rawQuery`가 문자열이 아니면(예: 배열이나 객체를 넣어 쿼리 연산자를 주입하려는 시도) 즉시 전체 상품 목록으로 폴백합니다. 문자열이면 `escapeRegExp`로 정규식 특수문자(`. * + ? ^ $ { } ( ) | [ ] \`)를 무력화한 뒤에만 `$regex`에 사용합니다.

### 4. IDOR 실습용 코드 — `app/orders/[id]/page.tsx`

11주차부터 있던 소유권 검사(`isOwner`/`isAdmin`) 코드 자체는 그대로 안전하게 유지했습니다. 다만 주석을 "왜 필요한지 설명"에서 "직접 지워보고 확인하는 실습 절차"로 바꿨습니다. 아래 **확인해보기**를 참고하세요.

- 그 외 파일은 12주차와 동일합니다(장바구니, 주문, 인증/RBAC 로직 등은 변경 없음).

## 확인해보기

```bash
cd template
cp .env.local.example .env.local
# MONGODB_URI, AUTH_SECRET 채우기 (7주차 참고)
npm install
npm run dev
```

**XSS 수정 확인**: 공지사항에 `<script>alert(1)</script>`를 넣고 저장한 뒤 상세 페이지를 열어보세요. 이제는 경고창이 뜨지 않고, 글자 그대로("&lt;script&gt;...") 화면에 보여야 합니다.

**시크릿 노출 수정 확인**: `/api/debug/env`에 접속하면 이제 `404`가 나야 합니다. 또한 `.env.local`에서 `AUTH_SECRET`을 잠깐 지우고 `npm run dev`를 다시 실행해보면, 서버가 조용히 기본값을 쓰는 대신 명확한 에러 메시지와 함께 즉시 종료되는 것을 확인할 수 있습니다.

**NoSQL Injection 방어 확인**: `/products?q=.*`처럼 정규식 특수문자를 검색창에 넣어보세요. 에러 없이 "`.*`라는 문자 그대로"를 이름에 포함한 상품만(보통 없음) 검색되어야 합니다 — 모든 상품이 나오거나 서버가 에러를 내면 이스케이프가 깨진 것입니다.

**IDOR 재현 + 원상복구 실습**: `app/orders/[id]/page.tsx`에서 `isOwner`/`isAdmin` 체크 세 줄을 잠깐 주석 처리하고 새로고침해보세요 — 로그인만 되어 있으면 다른 사용자의 주문 id로도 상세 내역이 그대로 보이는 것을 확인할 수 있습니다. **확인이 끝나면 반드시 원래대로 되돌리고 커밋 전에 diff로 재확인하세요** — 이 세 줄이 실제 배포판의 유일한 방어선입니다.

> `npx tsc --noEmit`, `npx eslint .` 모두 (clean `.next` 상태에서) **경고 없이 통과**합니다. `next dev`를 실제로 부팅해 위 네 가지(XSS 수정, 시크릿 fail-fast, 검색 이스케이프, IDOR 안전 상태)를 모두 확인했고, `/api/debug/env`가 `404`, `/orders`가 비로그인 시 `307` 리다이렉트하는 것도 함께 확인했습니다.

## 보안 메모

- **"필요 없던 위험"이 가장 흔한 취약점입니다**: XSS 수정에서 보듯, `dangerouslySetInnerHTML`은 애초에 문제를 해결하기 위해 필요하지 않았습니다. 위험한 API를 쓰기 전에 "이거 없이 못 하나?"를 먼저 물어보는 습관이 정적 분석보다 효과적인 경우가 많습니다.
- **"기본값"과 "즉시 실패" 중 무엇을 고를지**: 코드가 조용히 안전하지 않은 기본값으로 동작하는 것보다, 설정이 빠졌을 때 시끄럽게(에러와 함께) 멈추는 편이 훨씬 안전합니다. 프로덕션에서 "왜 이상하게 동작하지?"를 디버깅하는 것보다, 배포 파이프라인에서 바로 실패하는 게 낫습니다.
- **NoSQL Injection은 SQL Injection과 형태만 다릅니다**: MongoDB 쿼리는 JSON 객체이기 때문에, 사용자 입력이 문자열이 아니라 `{ "$ne": null }` 같은 연산자 객체로 들어오면 쿼리의 의미 자체가 바뀔 수 있습니다. `$regex`에 넣는 문자열도 정규식 특수문자를 이스케이프하지 않으면 예상 밖의 매칭(또는 ReDoS)이 발생할 수 있습니다.
- **인증(Authentication) vs 인가(Authorization)**: "로그인이 되어 있다"는 인증이고, "이 리소스에 접근할 권한이 있다"는 인가입니다. IDOR는 인증만 확인하고 인가를 빠뜨렸을 때 생깁니다. 두 세 줄의 소유권 검사가 이 두 가지를 가르는 유일한 경계선인 경우가 많습니다.

## 이번 주 체크리스트 (과제 #10)

- [ ] 12주차 XSS 재현이 더 이상 안 되는지 확인 (`<script>alert(1)</script>`가 글자 그대로 보이는지)
- [ ] `/api/debug/env`가 404인지 확인
- [ ] 검색어에 정규식 특수문자(`.*`, `(a|b)` 등)를 넣어도 에러 없이 "그 문자 그대로" 검색되는지 확인
- [ ] IDOR 재현(소유권 검사 세 줄 주석 처리) + 원상복구까지 확인
- [ ] 레포에 push + 무엇을 어떻게 고쳤는지 짧은 설명 (`.env.local` 제외) → submissions-2026에 repo_url · commit_sha · deploy_url PR 제출

## 슬라이드

`slides/week13.pptx`

## 이전 / 다음 주

- 이전: [week12](../week12/README.md)
- 다음: [week14](../week14/README.md)

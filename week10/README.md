# 10주차 — 고급 예제 I: 쇼핑몰 (착수)

`template/`은 9주차까지 만든 공지사항 게시판 프로젝트에, 새로운 도메인(쇼핑몰)을 얹은 것입니다. 인증(`auth.ts`/`auth.config.ts`/`proxy.ts`)과 DB 연결(`lib/mongodb.ts`)은 그대로 재사용하고, 상품 카탈로그와 장바구니만 새로 작성했습니다. 공지사항 게시판(`/notices`)은 비교·참고용으로 그대로 남아있습니다.

> 원래 계획에는 Mongoose `populate`나 `react-hook-form` + `Zod` 도입도 있었지만, 지금까지 배운 `<form action={...}>` + Server Action 패턴만으로도 장바구니 흐름을 충분히 구현할 수 있어 굳이 새 라이브러리를 얹지 않았습니다. 폼 라이브러리는 폼이 훨씬 복잡해지는 시점(다단계 결제 폼 등)에 필요하면 그때 소개합니다.

## 학습 목표

- 이미 만든 인증/DB 인프라를 새 도메인에 재사용한다 — 매번 프로젝트를 처음부터 만드는 게 아니라는 것을 확인한다.
- 로그인 여부와 무관하게 동작해야 하는 데이터(장바구니)를 어디에 저장할지 설계 대안(쿠키 vs localStorage vs 세션/DB)을 비교하고 트레이드오프를 이해한다.
- httpOnly 쿠키를 쓰더라도 "서버가 검증하지 않아도 되는 값"이 되는 것은 아니라는 점을 이해한다 — 쿠키도 결국 클라이언트가 들고 있는 값이다.
- 9주차의 "클라이언트 값은 못 믿는다" 원칙을 새로운 상황(수량·재고)에 다시 적용해본다.
- 민감한 값(가격)을 클라이언트가 들고 있는 저장소에 절대 두지 않고, 매번 서버에서 다시 조회하는 설계 습관을 들인다.

## template/ 폴더 안내 (9주차 대비 추가/변경된 파일)

- `models/Product.ts` (신규) — 상품 스키마(`name`, `description`, `price`, `emoji`, `stock`). 실제 이미지 업로드는 과목 범위 밖이라 이모지로 상품을 표시합니다.
- `lib/products.ts` (신규) — `getProducts()`/`getProduct(id)`/`getProductsByIds(ids)`. 상품 카탈로그는 공지사항과 달리 운영자가 채우는 데이터라, 컬렉션이 비어있으면 데모 상품으로 자동 시드합니다. 잘못된 형식의 id로 조회해도 예외 대신 `null`을 반환합니다.
- `lib/cart.ts` (신규) — httpOnly 쿠키(`cart`)에 `{ productId, qty }[]`만 저장하는 장바구니. 가격/이름은 저장하지 않습니다. `getCartLines`/`getCartCount`/`addToCart`/`updateCartQty`/`removeFromCart` 제공.
- `lib/actions.ts` — 기존 "좋아요" 액션을 제거하고 `addToCartAction`/`updateCartQtyAction`/`removeFromCartAction` 추가. 폼에서 넘어온 수량을 그대로 쓰지 않고, 실제 재고를 다시 조회해 그 범위로 맞춥니다.
- `app/products/page.tsx`, `app/products/[id]/page.tsx` — 4주차의 in-memory 샘플을 실제 MongoDB 카탈로그로 교체. 상세 페이지에 수량 입력 + 담기 폼 추가.
- `app/cart/page.tsx` (신규) — 장바구니 목록, 수량 변경/삭제, 합계. "결제하기" 버튼은 11주차까지 비활성 상태로 남겨둡니다.
- `components/SiteHeader.tsx` — 장바구니 링크 + 담긴 개수 배지 추가(로그인 여부와 무관하게 항상 표시).
- `components/LikeButton.tsx` — 삭제(더 이상 쓰이지 않는 4주차 "좋아요" 예제 컴포넌트).

### 실행해보기

```bash
cd template
cp .env.local.example .env.local
# MONGODB_URI, AUTH_SECRET 채우기 (7주차 참고)
npm install
npm run dev
# /products에서 상품을 몇 개 담아보고 /cart에서 수량을 바꾸거나 삭제해보세요.
# 로그인하지 않은 상태에서도 장바구니가 그대로 동작하는지 확인하세요.
```

> `npx tsc --noEmit`, `npx eslint .` 모두 (clean `.next` 상태에서) 통과를 확인했습니다.
> 추가로 `next dev`를 실제로 부팅해 `/`, `/products`, `/cart`, `/notices`, `/login`,
> `/api/auth/session`이 모두 정상 응답(200)하는 것을 확인했습니다. 이 샌드박스에는 실제
> MongoDB 클러스터가 연결돼 있지 않아 `/products`, `/cart`는 placeholder Mongo URI로 인한
> `ENOTFOUND` 에러가 발생하는데(9주차 `/notices`와 동일한 샌드박스 환경의 한계입니다), Next.js
> 개발 모드가 이를 클라이언트 렌더링으로 자동 전환해 페이지 자체는 계속 열립니다. 본인
> Atlas 클러스터를 연결하면 정상적으로 상품 목록이 나타납니다.

## 보안 메모

- **쿠키에 민감한 값을 직접 담지 않습니다.** 장바구니 쿠키에는 상품 id와 수량만 있고, 가격은 없습니다. 가격까지 쿠키에 있었다면 쿠키를 편집해서 더 싼 값으로 결제를 시도하는 공격이 가능해집니다 — 장바구니 페이지는 항상 최신 가격을 DB에서 다시 조회합니다.
- **httpOnly는 "서버가 안 믿어도 된다"는 뜻이 아닙니다.** httpOnly 쿠키는 브라우저의 자바스크립트(`document.cookie`)로부터는 안전하지만, 브라우저 개발자 도구(Application 탭)에서 직접 편집하는 것까지 막지는 못합니다. 그래서 수량은 여전히 서버(`addToCartAction`)에서 실제 재고 범위로 다시 검증합니다.
- **재사용은 좋지만, 재검토도 필요합니다.** 인증 인프라를 그대로 재사용했다고 해서 새 도메인의 보안 요구사항까지 자동으로 충족되는 것은 아닙니다 — 예를 들어 11주차에 주문(결제) 기능을 붙이면, "이 주문이 진짜 내 주문인가"(9주차의 소유권 개념)를 다시 확인해야 합니다.

## 이번 주 체크리스트 (과제 #7)

- [ ] 로그아웃 상태로 상품을 장바구니에 담고, 수량 변경/삭제까지 확인
- [ ] 상품 상세 페이지에서 재고보다 많은 수량을 입력해도 실제로는 재고만큼만 담기는지 확인
- [ ] MongoDB Atlas에서 아무 상품이나 `stock: 0`으로 바꿔 품절 상태(담기 버튼 비활성화)를 확인
- [ ] 레포에 push (`.env.local` 제외) → Vercel 배포 → submissions-2026에 repo_url · commit_sha · deploy_url PR 제출

## 슬라이드

`slides/week10.pptx`

## 이전 / 다음 주

- 이전: [week09](../week09/README.md)
- 다음: [week11](../week11/README.md)

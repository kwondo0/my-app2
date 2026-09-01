"use server";
// 이 파일의 함수들은 Server Action입니다. 클라이언트 컴포넌트에서
// 그냥 함수처럼 import해서 호출하면, Next.js가 자동으로 서버에
// 요청을 보내고 결과를 받아옵니다 — 별도의 API 엔드포인트를
// 직접 만들지 않아도 됩니다. (6주차 MongoDB CRUD에서 본격적으로 사용)

import { revalidatePath } from "next/cache";
import { likeProduct as likeProductInDb } from "@/lib/products";

export async function likeProductAction(id: string) {
  const newLikes = await likeProductInDb(id);
  // 이 경로를 다시 그리도록 Next.js에 알려줍니다 — 다른 탭/새로고침에서도
  // 최신 좋아요 수가 보이게 합니다.
  revalidatePath(`/products/${id}`);
  return newLikes;
}

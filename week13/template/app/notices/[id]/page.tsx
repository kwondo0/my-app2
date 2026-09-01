import { notFound } from "next/navigation";
import Link from "next/link";
import { getNotice } from "@/lib/notices";
import { auth } from "@/auth";
import { deleteNoticeAction } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

// products/[id]/page.tsx와 동일한 동적 라우팅 패턴입니다.
type Props = { params: Promise<{ id: string }> };

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const notice = await getNotice(id);

  if (!notice) {
    notFound();
  }

  const session = await auth();
  // 삭제 버튼을 보여줄지 말지는 여기서 결정하지만, 이건 순전히 사용자
  // 경험을 위한 것입니다. 실제 삭제 권한 검사는 deleteNoticeAction 안에서
  // (lib/actions.ts) 다시 한번 이뤄집니다 — 버튼이 안 보인다고 요청을
  // 못 보내는 건 아니기 때문입니다.
  const canDelete =
    !!session?.user && (session.user.id === notice.authorId || session.user.role === "admin");

  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-4 px-8 py-16">
      <Link href="/notices" className="text-sm text-zinc-500 hover:underline">
        ← 목록으로
      </Link>
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">{notice.title}</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {notice.authorName} · {notice.createdAt}
      </p>
      {/*
        ✅ [13주차 · 수정] 12주차의 dangerouslySetInnerHTML을 제거했습니다.
        돌이켜보면 애초에 필요하지 않았습니다 — "줄바꿈을 보여주고 싶다"는
        요구사항은 HTML로 해석할 필요 없이 CSS의 white-space: pre-wrap
        (Tailwind의 whitespace-pre-wrap)만으로 충분합니다. React가
        {"{content}"}처럼 중괄호로 값을 렌더링하면 HTML 특수문자를 자동으로
        이스케이프하므로, <script> 같은 값이 들어와도 문자 그대로 화면에
        찍힐 뿐 실행되지 않습니다. "정말로" 사용자가 입력한 리치 텍스트를
        HTML로 보여줘야 하는 경우라면 DOMPurify 같은 새니타이저로 위험한
        태그/속성을 걸러낸 뒤에만 dangerouslySetInnerHTML을 써야 합니다 —
        하지만 가장 안전한 수정은 애초에 그 API가 필요 없는 상황을
        만드는 것입니다.
      */}
      <p className="whitespace-pre-wrap leading-7 text-zinc-700 dark:text-zinc-300">
        {notice.content}
      </p>

      {canDelete && (
        <form action={deleteNoticeAction} className="pt-2">
          <input type="hidden" name="id" value={notice.id} />
          <SubmitButton label="삭제" />
        </form>
      )}
    </div>
  );
}

import { useState } from "react";
import useNoticeSocket, { type Notice } from "../../hooks/useNoticeSocket";
import ConnectionBadge from "./ConnectionBadge";

// WebSocket Case (읽는 쪽) — 다른 탭에서 등록한 공지·댓글이 새로고침 없이 들어온다

const timeOf = (at: number) =>
  new Date(at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

interface CardProps {
  notice: Notice;
  myNickname: string;
  onComment: (noticeId: string, text: string) => void;
  onTyping: (noticeId: string) => void;
  typers: string[];
}

const NoticeCard = ({ notice, myNickname, onComment, onTyping, typers }: CardProps) => {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onComment(notice.id, text);
    setText("");
  };

  // 내가 입력중인 건 나에게 안 보여야 한다 (서버도 발신자는 빼고 보내지만 방어적으로)
  const others = typers.filter((name) => name !== myNickname);

  return (
    <li className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="text-sm text-gray-900">{notice.text}</p>
      <p className="mt-1 text-xs text-gray-400">
        {notice.author} · {timeOf(notice.at)}
      </p>

      {notice.comments.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
          {notice.comments.map((comment) => (
            <li key={comment.id} className="text-xs">
              <span className="font-medium text-gray-700">{comment.author}</span>
              <span className="ml-2 text-gray-600">{comment.text}</span>
              <span className="ml-2 text-gray-300">{timeOf(comment.at)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* 입력중 표시 — 자리를 항상 차지해 나타날 때 레이아웃이 튀지 않게 */}
      <p className="mt-2 h-4 text-xs text-sky-600">
        {others.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-sky-500" />
            {others.join(", ")} 님이 입력 중…
          </span>
        )}
      </p>

      <div className="mt-1 flex gap-2">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping(notice.id);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="댓글을 입력하세요"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-sky-500"
        />
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
        >
          등록
        </button>
      </div>
    </li>
  );
};

const NoticeBoardPage = () => {
  const { status, nickname, online, notices, addComment, notifyTyping, typersOf } = useNoticeSocket();

  return (
    <div>
      <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm">
        <p className="font-bold text-sky-800">WebSocket 구현 — 공지 보기</p>
        <p className="text-sky-700">
          요청하지 않아도 서버가 밀어줍니다. <b>공지 등록</b> 화면을 다른 탭에 띄우고 등록해보세요.
        </p>
      </div>

      <ConnectionBadge status={status} nickname={nickname} online={online} />

      <ul className="space-y-2">
        {notices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            myNickname={nickname}
            onComment={addComment}
            onTyping={notifyTyping}
            typers={typersOf(notice.id)}
          />
        ))}

        {notices.length === 0 && (
          <li className="rounded-xl border border-gray-100 bg-white py-16 text-center text-sm text-gray-400">
            아직 공지가 없습니다. <b>공지 등록</b> 메뉴에서 하나 올려보세요.
          </li>
        )}
      </ul>
    </div>
  );
};

export default NoticeBoardPage;

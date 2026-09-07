import { useState } from "react";
import useNoticeSocket from "../../hooks/useNoticeSocket";
import ConnectionBadge from "./ConnectionBadge";

// WebSocket Case (쓰는 쪽) — 여기서 등록하면 /ws 화면에 즉시 나타난다

const NoticeWritePage = () => {
  const { status, nickname, online, notices, addNotice, notifyTyping, typersOf } = useNoticeSocket();
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    addNotice(text);
    setText("");
  };

  // 공지 입력창에서 타이핑 → noticeId 없이(null) 신호를 보낸다
  const othersTyping = typersOf(null).filter((name) => name !== nickname);

  return (
    <div>
      <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm">
        <p className="font-bold text-sky-800">WebSocket 구현 — 공지 등록</p>
        <p className="text-sky-700">
          여기서 등록하면 <b>공지 보기</b> 화면에 새로고침 없이 즉시 나타납니다. 두 탭을 나란히 열어보세요.
        </p>
      </div>

      <ConnectionBadge status={status} nickname={nickname} online={online} />

      <div className="mb-3 rounded-xl border border-gray-100 bg-white p-3">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            notifyTyping(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          rows={3}
          placeholder="공지 내용을 입력하세요 (⌘/Ctrl + Enter 로 등록)"
          className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-sky-500"
        />

        <div className="mt-2 flex h-8 items-center justify-between">
          <span className="text-xs text-sky-600">
            {othersTyping.length > 0 && `${othersTyping.join(", ")} 님이 공지를 작성 중…`}
          </span>
          <button
            onClick={submit}
            disabled={!text.trim() || status !== "open"}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            공지 등록
          </button>
        </div>
      </div>

      <p className="mb-2 text-xs text-gray-400">등록된 공지 {notices.length}건</p>

      <ul className="space-y-2">
        {notices.map((notice) => (
          <li key={notice.id} className="rounded-xl border border-gray-100 bg-white p-3">
            <p className="text-sm text-gray-900">{notice.text}</p>
            <p className="mt-1 text-xs text-gray-400">
              {notice.author} · 댓글 {notice.comments.length}
            </p>
          </li>
        ))}
        {notices.length === 0 && (
          <li className="rounded-xl border border-gray-100 bg-white py-12 text-center text-sm text-gray-400">
            아직 등록된 공지가 없습니다.
          </li>
        )}
      </ul>
    </div>
  );
};

export default NoticeWritePage;

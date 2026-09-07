import type { ConnStatus } from "../../hooks/useNoticeSocket";

const LABEL: Record<ConnStatus, { text: string; dot: string; tone: string }> = {
  connecting: { text: "연결 중", dot: "bg-amber-400 animate-pulse", tone: "text-amber-300" },
  open: { text: "연결됨", dot: "bg-emerald-400", tone: "text-emerald-300" },
  closed: { text: "끊김 — 재연결 시도 중", dot: "bg-rose-400 animate-pulse", tone: "text-rose-300" },
};

interface Props {
  status: ConnStatus;
  nickname: string;
  online: number;
}

/** 연결 상태는 웹소켓 화면에서 항상 보여야 한다. 끊긴 줄 모르고 쓰는 게 제일 나쁘다 */
const ConnectionBadge = ({ status, nickname, online }: Props) => {
  const { text, dot, tone } = LABEL[status];

  return (
    <div className="sticky top-0 z-10 mb-3 flex items-center justify-between rounded-lg bg-gray-900 p-3 font-mono text-xs text-white">
      <span className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className={tone}>{text}</span>
      </span>

      <span className="text-gray-400">
        나: <span className="text-white">{nickname || "…"}</span>
        <span className="mx-2 text-gray-600">|</span>
        접속 <span className="font-bold text-white">{online}</span>명
      </span>
    </div>
  );
};

export default ConnectionBadge;

import { useCallback, useEffect, useRef, useState } from "react";

export interface Comment {
  id: string;
  text: string;
  author: string;
  at: number;
}

export interface Notice {
  id: string;
  text: string;
  author: string;
  at: number;
  comments: Comment[];
}

export type ConnStatus = "connecting" | "open" | "closed";

interface Typer {
  noticeId: string | null;
  nickname: string;
  at: number;
}

/** 입력중 표시가 살아있는 시간 */
const TYPING_TTL = 3000;
/** 타이핑 신호를 서버로 보내는 최소 간격 (글자마다 보내지 않는다) */
const TYPING_THROTTLE = 1000;

/**
 * 공지/댓글 실시간 소켓.
 *
 * 폴링과 다른 점: 우리가 아무것도 요청하지 않아도 서버가 먼저 밀어준다.
 * 그래서 다른 탭에서 등록한 공지가 이 화면에 그냥 나타난다.
 */
const useNoticeSocket = () => {
  const [status, setStatus] = useState<ConnStatus>("connecting");
  const [nickname, setNickname] = useState("");
  const [online, setOnline] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [typers, setTypers] = useState<Typer[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const lastTypingSentRef = useRef(0);

  useEffect(() => {
    let unmounted = false;
    let retryTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      if (unmounted) return;

      const scheme = location.protocol === "https:" ? "wss:" : "ws:";
      const ws = new WebSocket(`${scheme}//${location.host}/ws-api`);
      wsRef.current = ws;
      setStatus("connecting");

      ws.onopen = () => setStatus("open");

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case "welcome":
            // 접속하면 서버가 현재 상태를 통째로 넘겨준다
            setNickname(msg.nickname);
            setNotices(msg.notices);
            setOnline(msg.online);
            break;

          case "presence":
            setOnline(msg.online);
            break;

          case "notice:added":
            setNotices((prev) => [msg.notice, ...prev]);
            break;

          case "comment:added":
            setNotices((prev) =>
              prev.map((notice) =>
                notice.id === msg.noticeId
                  ? { ...notice, comments: [...notice.comments, msg.comment] }
                  : notice
              )
            );
            break;

          case "typing":
            // 저장하지 않는다. 같은 사람의 이전 신호는 지우고 새로 찍는다
            setTypers((prev) => [
              ...prev.filter((t) => !(t.nickname === msg.nickname && t.noticeId === msg.noticeId)),
              { noticeId: msg.noticeId, nickname: msg.nickname, at: Date.now() },
            ]);
            break;
        }
      };

      ws.onclose = () => {
        setStatus("closed");
        // 서버가 재시작되면(파일 저장 등) 알아서 다시 붙는다
        if (!unmounted) retryTimer = setTimeout(connect, 1500);
      };
    };

    connect();

    return () => {
      unmounted = true;
      clearTimeout(retryTimer);
      wsRef.current?.close();
    };
  }, []);

  // 시간이 지난 입력중 표시를 걷어낸다
  useEffect(() => {
    const id = setInterval(() => {
      setTypers((prev) => {
        const alive = prev.filter((t) => Date.now() - t.at < TYPING_TTL);
        return alive.length === prev.length ? prev : alive;
      });
    }, 500);
    return () => clearInterval(id);
  }, []);

  const send = useCallback((message: object) => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
  }, []);

  const addNotice = useCallback((text: string) => send({ type: "notice:add", text }), [send]);

  const addComment = useCallback(
    (noticeId: string, text: string) => send({ type: "comment:add", noticeId, text }),
    [send]
  );

  /** 타이핑할 때마다 부르되, 실제 전송은 1초에 한 번으로 제한한다 */
  const notifyTyping = useCallback(
    (noticeId: string | null) => {
      const now = Date.now();
      if (now - lastTypingSentRef.current < TYPING_THROTTLE) return;
      lastTypingSentRef.current = now;
      send({ type: "typing", noticeId });
    },
    [send]
  );

  /** 특정 공지에 지금 댓글 쓰고 있는 사람들 */
  const typersOf = useCallback(
    (noticeId: string | null) =>
      typers.filter((t) => t.noticeId === noticeId).map((t) => t.nickname),
    [typers]
  );

  return { status, nickname, online, notices, typers, addNotice, addComment, notifyTyping, typersOf };
};

export default useNoticeSocket;

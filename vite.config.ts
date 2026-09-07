import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { WebSocketServer, type WebSocket } from "ws";

/**
 * 공지/댓글 브로드캐스트 서버.
 *
 * 별도 프로세스를 띄우지 않고 Vite dev 서버의 HTTP 서버에 얹는다.
 * Vite 자신도 HMR 용 웹소켓을 쓰므로, /ws-api 경로로 들어온 것만 가로채고
 * 나머지 upgrade 요청은 손대지 않아야 HMR 이 살아있다.
 */
function noticeSocketServer(): PluginOption {
  const ADJECTIVES = ["기민한", "졸린", "용감한", "수줍은", "느긋한", "성실한", "엉뚱한", "다정한"];
  const ANIMALS = ["너구리", "수달", "고양이", "펭귄", "여우", "다람쥐", "올빼미", "두더지"];

  interface Comment {
    id: string;
    text: string;
    author: string;
    at: number;
  }
  interface Notice {
    id: string;
    text: string;
    author: string;
    at: number;
    comments: Comment[];
  }

  return {
    name: "notice-socket-server",
    configureServer(server) {
      const wss = new WebSocketServer({ noServer: true });

      // 메모리 저장소. 서버가 재시작되면 사라진다 (학습용이므로 DB 없음)
      const notices: Notice[] = [];
      const nicknames = new Map<WebSocket, string>();
      let seq = 0;

      const nextId = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`;

      const randomNickname = () =>
        `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${
          ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
        }`;

      /** 접속한 전원에게. except 를 주면 그 사람만 빼고 (입력중 신호는 본인에게 안 보낸다) */
      const broadcast = (message: unknown, except?: WebSocket) => {
        const payload = JSON.stringify(message);
        for (const client of wss.clients) {
          if (client === except) continue;
          if (client.readyState === client.OPEN) client.send(payload);
        }
      };

      server.httpServer?.on("upgrade", (request, socket, head) => {
        // 우리 경로가 아니면 절대 건드리지 않는다 (Vite HMR 이 여기로 온다)
        if (!request.url?.startsWith("/ws-api")) return;

        wss.handleUpgrade(request, socket, head, (ws) => wss.emit("connection", ws));
      });

      wss.on("connection", (ws) => {
        const nickname = randomNickname();
        nicknames.set(ws, nickname);

        // 갓 들어온 사람에게 현재 상태를 통째로 보낸다
        ws.send(JSON.stringify({ type: "welcome", nickname, notices, online: wss.clients.size }));
        broadcast({ type: "presence", online: wss.clients.size }, ws);

        ws.on("message", (raw) => {
          let msg: { type?: string; text?: string; noticeId?: string };
          try {
            msg = JSON.parse(String(raw));
          } catch {
            return; // 깨진 메시지는 무시
          }

          const author = nicknames.get(ws) ?? "알 수 없음";

          if (msg.type === "notice:add" && msg.text?.trim()) {
            const notice: Notice = {
              id: nextId(),
              text: msg.text.trim().slice(0, 200),
              author,
              at: Date.now(),
              comments: [],
            };
            notices.unshift(notice);
            broadcast({ type: "notice:added", notice });
            return;
          }

          if (msg.type === "comment:add" && msg.text?.trim()) {
            const notice = notices.find((n) => n.id === msg.noticeId);
            if (!notice) return;

            const comment: Comment = {
              id: nextId(),
              text: msg.text.trim().slice(0, 200),
              author,
              at: Date.now(),
            };
            notice.comments.push(comment);
            broadcast({ type: "comment:added", noticeId: notice.id, comment });
            return;
          }

          // 입력중 신호 — 저장하지 않는다. 지금 듣고 있는 사람에게만 흘려보낸다
          if (msg.type === "typing") {
            broadcast({ type: "typing", noticeId: msg.noticeId ?? null, nickname: author }, ws);
          }
        });

        ws.on("close", () => {
          nicknames.delete(ws);
          broadcast({ type: "presence", online: wss.clients.size });
        });
      });

      server.httpServer?.on("close", () => wss.close());
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), noticeSocketServer()],
});

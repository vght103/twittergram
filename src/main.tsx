import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";
import { queryClient } from "./lib/queryClient";
import "./index.css";
import App from "./App.tsx";
import TsrApp from "./tsr/TsrApp.tsx";

// 라우터는 window.history 를 소유한다. 한 앱에 둘을 같이 띄울 수 없으므로
// 경로로 갈라서 react-router 앱 / TanStack Router 앱 중 하나만 마운트한다.
// (그래서 /tsr 로 오가는 링크는 <Link> 가 아니라 <a> 여야 한다 — 전체 리로드)
const isTanStackRouter = window.location.pathname.startsWith("/tsr");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {isTanStackRouter ? (
        <TsrApp />
      ) : (
        <TDSMobileAITProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TDSMobileAITProvider>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);

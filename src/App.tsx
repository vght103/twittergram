import { Navigate, Route, Routes } from "react-router";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import OriginalPage from "./pages/original/OriginalPage";
import TanstackPage from "./pages/tanstack/TanstackPage";
import VirtualPage from "./pages/virtual/VirtualPage";
import "./App.css";

function App() {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* 사이드바 (md 이상) */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-xl mx-auto p-4 pb-20 md:pb-4">
        <Routes>
          <Route path="/" element={<Navigate to="/tanstack" replace />} />
          <Route path="/original" element={<OriginalPage />} />
          <Route path="/tanstack" element={<TanstackPage />} />
          <Route path="/virtual" element={<VirtualPage />} />
        </Routes>
      </main>

      {/* 모바일 하단 네비 (md 미만) */}
      <MobileNav />
    </div>
  );
}

export default App;

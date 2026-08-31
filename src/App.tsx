import { Navigate, Route, Routes } from "react-router";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import OriginalPage from "./pages/original/OriginalPage";
import TanstackPage from "./pages/tanstack/TanstackPage";
import VirtualPage from "./pages/virtual/VirtualPage";
import InfiniteVirtualPage from "./pages/infinite-virtual/InfiniteVirtualPage";
import TdsPage from "./pages/tds/TdsPage";
import SearchParamsPage from "./pages/search-params/SearchParamsPage";
import "./App.css";
import StockDetail from "./pages/tds/detail/StockDetail";

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
          <Route path="/infinite-virtual" element={<InfiniteVirtualPage />} />
          <Route path="/tds" element={<TdsPage />} />
          <Route path="/tds/:id" element={<StockDetail />} />
          <Route path="/search-params" element={<SearchParamsPage />} />
        </Routes>
      </main>

      {/* 모바일 하단 네비 (md 미만) */}
      <MobileNav />
    </div>
  );
}

export default App;

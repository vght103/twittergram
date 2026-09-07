import { NavLink } from "react-router";

const navItems = [
  { to: "/original", label: "Original", description: "useState + Observer" },
  { to: "/tanstack", label: "TanStack Query", description: "useInfiniteQuery" },
  { to: "/virtual", label: "Virtual Scroll", description: "react-virtual" },
  { to: "/infinite-virtual", label: "Infinite + Virtual", description: "무한 + 가상 조합" },
  { to: "/tds", label: "스톡 검색", description: "목록 구현" },
  { to: "/search-params", label: "URL 검색/필터", description: "useSearchParams" },
  { to: "/tsr", label: "TanStack Router", description: "validateSearch (타입 있는 검색)", external: true },
  { to: "/ws", label: "공지 보기", description: "WebSocket 실시간 수신" },
  { to: "/ws/write", label: "공지 등록", description: "WebSocket 실시간 발신" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0 hidden md:block">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold">TwitterGram</h1>
        <p className="text-sm text-gray-400 mt-1">구현 비교</p>
      </div>

      <nav className="p-3">
        {navItems.map((item) => {
          const body = (
            <>
              <p className="text-base">{item.label}</p>
              <p className="text-sm text-gray-400">{item.description}</p>
            </>
          );
          const base = "block px-4 py-4 rounded-lg mb-1 transition-colors";

          // 라우터가 다른 앱이므로 <a> 로 전체 리로드시킨다
          return item.external ? (
            <a key={item.to} href={item.to} className={`${base} text-gray-600 hover:bg-gray-50`}>
              {body}
            </a>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${base} ${isActive ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-600 hover:bg-gray-50"}`
              }
            >
              {body}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

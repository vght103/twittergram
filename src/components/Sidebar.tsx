import { NavLink } from "react-router";

const navItems = [
  { to: "/original", label: "Original", description: "useState + Observer" },
  { to: "/tanstack", label: "TanStack Query", description: "useInfiniteQuery" },
  { to: "/virtual", label: "Virtual Scroll", description: "react-virtual" },
  { to: "/infinite-virtual", label: "Infinite + Virtual", description: "무한 + 가상 조합" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0 hidden md:block">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold">TwitterGram</h1>
        <p className="text-sm text-gray-400 mt-1">구현 비교</p>
      </div>

      <nav className="p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-4 py-4 rounded-lg mb-1 transition-colors ${
                isActive
                  ? "bg-gray-100 font-semibold text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <p className="text-base">{item.label}</p>
            <p className="text-sm text-gray-400">{item.description}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

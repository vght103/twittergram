import { NavLink } from "react-router";

const navItems = [
  { to: "/original", label: "Original", description: "useState + Observer", color: "yellow" },
  { to: "/tanstack", label: "TanStack Query", description: "useInfiniteQuery", color: "blue" },
  { to: "/virtual", label: "Virtual Scroll", description: "react-virtual", color: "green" },
];

const Sidebar = () => {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0 hidden md:block">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">TwitterGram</h1>
        <p className="text-xs text-gray-400 mt-1">구현 비교</p>
      </div>

      <nav className="p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-3 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? "bg-gray-100 font-semibold text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <p className="text-sm">{item.label}</p>
            <p className="text-xs text-gray-400">{item.description}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

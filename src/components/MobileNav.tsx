import { NavLink } from "react-router";

const navItems = [
  { to: "/original", label: "Original" },
  { to: "/tanstack", label: "TanStack" },
  { to: "/virtual", label: "Virtual" },
  { to: "/infinite-virtual", label: "Inf+Virt" },
  { to: "/tds", label: "TDS" },
  { to: "/search-params", label: "Params" },
  { to: "/tsr", label: "TSR", external: true },
];

const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-10">
      <ul className="flex">
        {navItems.map((item) => (
          <li key={item.to} className="min-w-0 flex-1">
            {item.external ? (
              <a href={item.to} className="block truncate text-center py-3 text-xs text-gray-500">
                {item.label}
              </a>
            ) : (
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block truncate text-center py-3 text-xs transition-colors ${
                    isActive ? "font-bold text-gray-900 bg-gray-50" : "text-gray-500"
                  }`
                }
              >
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;

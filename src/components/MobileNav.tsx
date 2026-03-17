import { NavLink } from "react-router";

const navItems = [
  { to: "/original", label: "Original" },
  { to: "/tanstack", label: "TanStack" },
  { to: "/virtual", label: "Virtual" },
];

const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-10">
      <ul className="flex">
        {navItems.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `block text-center py-3 text-sm transition-colors ${
                  isActive ? "font-bold text-gray-900 bg-gray-50" : "text-gray-500"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;

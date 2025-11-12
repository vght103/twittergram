import { NavLink } from "react-router";

const NavBar = ({ openModal }: { openModal: () => void }) => {
  return (
    <nav>
      <ul className="flex items-center gap-4 text-lg font-bold cursor-pointer">
        <li className="px-2 py-1" onClick={() => {}}>
          <NavLink to="/">홈</NavLink>
        </li>
        <li className="px-2 py-1" onClick={() => {}}>
          <span onClick={() => openModal()}>추가</span>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

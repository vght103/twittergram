import { Link, useLocation } from "react-router";
import { useUserStore } from "../stores/userStore";
import NewIcon from "./icons/NewIcon";
import UserCard from "./UserCard";
import HomeIcon from "./icons/HomeIcon";
import ToggleIcon from "./ToggleIcon";
import HomeIconFill from "./icons/HomeIconFill";

const NavBar = () => {
  const { user } = useUserStore();
  const { pathname } = useLocation();
  return (
    <nav className="">
      <ul className="flex items-center sm:justify-between justify-around gap-5 text-lg font-bold cursor-pointer">
        <li className="flex justify-center px-2 py-1 flex-1">
          <Link to="/" className="flex items-center">
            <ToggleIcon
              toggled={pathname === "/"}
              onToggle={<HomeIconFill />}
              offToggle={<HomeIcon />}
              onClick={() => {}}
            />
            <span className="ml-2 md:block hidden">Home</span>
          </Link>
        </li>

        <li className="flex justify-center px-2 py-1 flex-1">
          <Link to="/compose" className="flex items-center">
            <NewIcon />
            <span className="ml-2 md:block hidden">New</span>
          </Link>
        </li>
        <li className="flex justify-center px-2 py-1 flex-1">{user && <UserCard userInfo={user} />}</li>
      </ul>
    </nav>
  );
};

export default NavBar;

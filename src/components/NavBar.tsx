import { useUserInfo } from "../context/userInfo";
import NewIcon from "./icons/NewIcon";
import UserCard from "./UserCard";

const NavBar = ({ openModal }: { openModal: () => void }) => {
  const user = useUserInfo();

  return (
    <nav>
      <ul className="flex items-center gap-4 text-lg font-bold cursor-pointer">
        <li className="flex items-center px-2 py-1 " onClick={() => {}}>
          {user && <UserCard userInfo={user} />}
          <button className="cursor-pointer ml-2" onClick={openModal}>
            <NewIcon />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

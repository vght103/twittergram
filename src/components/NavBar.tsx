import NewIcon from "./icons/NewIcon";

const NavBar = ({ openModal }: { openModal: () => void }) => {
  return (
    <nav>
      <ul className="flex items-center gap-4 text-lg font-bold cursor-pointer">
        <li className="px-2 py-1" onClick={() => {}}>
          <button className="cursor-pointer" onClick={openModal}>
            <NewIcon />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

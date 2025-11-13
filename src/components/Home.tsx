import { useLocation, useNavigate } from "react-router";
import Modal from "./Modal";
import NavBar from "./NavBar";
import PostFormModal from "./PostFormModal";
import PostList from "./PostList";

const Home = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* 상단 헤더 - sm 이상에서만 NavBar 표시 */}
      <header className="position-absolute top-0 left-0 right-0 sticky z-10 bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TwitterGram</h1>
          <div className="hidden sm:block">
            <NavBar />
          </div>
        </div>
      </header>
      <main className="w-full max-w-4xl mx-auto">
        <PostList />
        {pathname.includes("/compose") && (
          <Modal>
            <PostFormModal
              onClose={() => {
                navigate("/");
              }}
            />
          </Modal>
        )}
      </main>

      {/* 하단 NavBar - sm 미만에서만 표시 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-10">
        <div className="max-w-4xl mx-auto">
          <NavBar />
        </div>
      </nav>
    </>
  );
};

export default Home;

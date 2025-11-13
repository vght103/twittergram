import { useState } from "react";
import NavBar from "./NavBar";
import PostList from "./PostList";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <header className="p-4 position-absolute top-0 left-0 right-0 sticky z-10 bg-white border-b border-gray-200">
        <div className=" max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TwitterGram</h1>
          <NavBar openModal={openModal} />
        </div>
      </header>
      <main className="w-full max-w-4xl mx-auto">
        <PostList modalOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </main>
    </>
  );
};

export default Home;

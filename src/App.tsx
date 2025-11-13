import { useEffect, useState } from "react";
import "./App.css";
import Home from "./components/Home";
import Modal from "./components/Modal";
import NavBar from "./components/NavBar";
import PostFormModal from "./components/PostFormModal";

function App() {
  //  마운트 시 스크롤 최상단
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <div className="w-full h-full  position-relative bg-neutral-50">
      <header className="p-4 position-absolute top-0 left-0 right-0 sticky z-10 bg-white border-b border-gray-200">
        <div className=" max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TGram</h1>
          <NavBar openModal={openModal} />
        </div>
      </header>
      <main className="w-full max-w-4xl mx-auto">
        <Home />
      </main>
      <footer className="">
        <h1>Footer</h1>
      </footer>
      {modalOpen && (
        <Modal>
          <PostFormModal setModalOpen={setModalOpen} />
        </Modal>
      )}
    </div>
  );
}

export default App;

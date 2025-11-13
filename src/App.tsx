import { useEffect } from "react";
import "./App.css";
import Home from "./components/Home";

function App() {
  //  마운트 시 스크롤 최상단
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-full  position-relative bg-neutral-50">
      <Home />
    </div>
  );
}

export default App;

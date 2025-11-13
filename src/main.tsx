import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { UserInfoContext } from "./context/userInfo.ts";
import loginUser from "./data/loginUser.json";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserInfoContext.Provider value={loginUser}>
        <App />
      </UserInfoContext.Provider>
    </BrowserRouter>
  </StrictMode>
);

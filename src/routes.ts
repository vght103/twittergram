import AddForm from "./components/AddForm";
import Main from "./components/Home";

export const routeList = [
  {
    path: "/",
    element: Main,
  },
  {
    path: "/add",
    element: AddForm,
  },
];

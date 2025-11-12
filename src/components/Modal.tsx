import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
};

const Modal = ({ children }: Props) => {
  return <>{createPortal(<>{children}</>, document.getElementById("modal") as HTMLElement)}</>;
};

export default Modal;

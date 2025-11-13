import { IoMdClose } from "react-icons/io";

type Props = {
  className?: string;
};

const CloseIcon = ({ className }: Props) => {
  return <IoMdClose className={`${className ? className : ""} w-7 h-7`} />;
};
export default CloseIcon;

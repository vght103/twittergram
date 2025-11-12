import { FaRegHeart } from "react-icons/fa";

type Props = {
  className?: string;
};

const HeartIcon = ({ className }: Props) => {
  return (
    <div>
      <FaRegHeart className={className || "w-7 h-7"} />
    </div>
  );
};
export default HeartIcon;

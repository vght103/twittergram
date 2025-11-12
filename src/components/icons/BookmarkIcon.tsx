import React from "react";
import { FaRegBookmark } from "react-icons/fa";

type Props = {
  className?: string;
};

const BookmarkIcon = ({ className }: Props) => {
  return <FaRegBookmark className={className || "w-6 h-6"} />;
};
export default BookmarkIcon;

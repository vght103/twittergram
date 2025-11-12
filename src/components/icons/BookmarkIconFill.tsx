import React from "react";
import { FaBookmark } from "react-icons/fa6";
type Props = {
  className?: string;
};
const BookmarkIconFill = ({ className }: Props) => {
  return <FaBookmark className={className || "w-6 h-6 fill-cyan-600"} />;
};
export default BookmarkIconFill;

import React from "react";
import { FaRetweet } from "react-icons/fa";

type Props = {
  className?: string;
};

const ReTweetIcon = ({ className }: Props) => {
  return <FaRetweet className={`${className ? className : ""} w-6 h-6`} />;
};

export default ReTweetIcon;

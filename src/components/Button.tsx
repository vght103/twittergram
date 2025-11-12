import React from "react";

type Props = {
  title: string;
  onClick: () => void;
};

const Button = ({ title, onClick }: Props) => {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={onClick}>
      {title}
    </button>
  );
};

export default Button;

import React, { type ReactNode } from "react";

type Props = {
  toggled: boolean;
  onToggle: ReactNode;
  offToggle?: ReactNode;
  count?: number;
  onClick: () => void;
};

const ToggleIcon = ({ toggled, onToggle, offToggle, count, onClick }: Props) => {
  return (
    <div className="cursor-pointer flex items-center" onClick={onClick}>
      {toggled ? onToggle : offToggle}

      <p className="text-sm text-gray-500 ml-1">{count}</p>
    </div>
  );
};

export default ToggleIcon;

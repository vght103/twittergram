type Props = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
};

const Button = ({ title, onClick, disabled = false }: Props) => {
  return (
    <button
      disabled={disabled}
      className={` ${disabled ? "bg-gray-300" : "bg-blue-500"} text-white px-4 py-2 rounded-md cursor-pointer`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;

type Props = {
  userInfo: {
    name: string;
    username: string;
    profileImage: string;
  };
};

const UserCard = ({ userInfo }: Props) => {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full border-2 border-amber-300  "
          src={userInfo.profileImage}
          alt={userInfo.name}
        />
        <span className="font-bold ml-1.5">{`${userInfo.username}`}</span>
      </div>
    </div>
  );
};

export default UserCard;

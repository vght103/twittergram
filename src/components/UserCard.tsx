type Props = {
  userInfo: {
    name: string;
    username: string;
    profileImage: string;
  };
};

const UserCard = ({ userInfo }: Props) => {
  return (
    <div className="flex items-center p-2 justify-between">
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full border-2 border-amber-300 mr-1.5"
          src={userInfo.profileImage}
          alt={userInfo.name}
        />
        <p className="font-bold">{`${userInfo.username}`}</p>
      </div>
    </div>
  );
};

export default UserCard;

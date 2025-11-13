import { createContext, useContext } from "react";
export type UserInfoType = {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  verified: boolean;
};

export const UserInfoContext = createContext<UserInfoType | null>(null);

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

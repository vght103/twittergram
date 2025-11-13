import { create } from "zustand";
import loginUser from "../data/loginUser.json";

export type UserInfoType = {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  verified: boolean;
};

type UserStore = {
  user: UserInfoType;
};

export const useUserStore = create<UserStore>(() => ({
  user: loginUser,
}));

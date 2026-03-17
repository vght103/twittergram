import { useQuery } from "@tanstack/react-query";
import { fetchPostsAsync } from "../api/feedApi";

export const usePostsQuery = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPostsAsync({ page, limit }),
  });
};

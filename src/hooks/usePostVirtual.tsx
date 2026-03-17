import { useQuery } from "@tanstack/react-query";
import { fetchAllPhotosAsync } from "../api/feedApi";

const usePostVirtual = () => {
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ["posts-virtual"],
    queryFn: fetchAllPhotosAsync,
  });

  return {
    posts,
    loading: isLoading,
    isError,
    totalLoaded: posts.length,
  };
};

export default usePostVirtual;

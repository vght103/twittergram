import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPostsAsync } from "../api/feedApi";

const LIMIT = 10;

const usePostInfiniteVirtual = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
    queryKey: ["posts-infinite-virtual"],
    queryFn: ({ pageParam = 0 }) => fetchPostsAsync(pageParam, LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return {
    posts,
    loading: isLoading,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
    totalLoaded: posts.length,
  };
};

export default usePostInfiniteVirtual;

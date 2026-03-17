import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import {
  createPostAsync,
  fetchPostsAsync,
  toggleBookmarkAsync,
  toggleLikeAsync,
  toggleRetweetAsync,
} from "../api/feedApi";
import { usePostsStore } from "../stores/postsStore";
import type { PostRequest } from "../api/feed-type";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "react-router";

const LIMIT = 10;

const usePost = () => {
  const navigate = useNavigate();

  // 로그인 유저 정보
  const { user } = useUserStore();

  // 낙관적 업데이트용 store (추후 Phase에서 useMutation으로 교체 예정)
  const { toggleLike, toggleBookmark, toggleRetweet } = usePostsStore();

  // 무한 스크롤 - useInfiniteQuery
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 0 }) => fetchPostsAsync(pageParam, LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });

  // 스크롤 감지 - react-intersection-observer
  const { ref: observerTarget, inView } = useInView({
    rootMargin: "500px",
  });

  // inView가 true가 되면 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // pages 배열을 flat하게 변환
  console.log("data", data);
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  // 포스트 생성 함수
  const handleSubmitPost = async (request: { content: string; images: string[] }) => {
    const requestBody: PostRequest = {
      content: request.content,
      images: request.images,
      author: {
        name: user?.name || "",
        username: user?.username || "",
        profileImage: user?.profileImage || "",
        verified: user?.verified || false,
      },
    };

    const result = await createPostAsync(requestBody);

    if (result) {
      navigate("/");
    }
  };

  // 좋아요 토글
  const handleToggleLike = async (postId: number) => {
    toggleLike(postId);
    await toggleLikeAsync(postId);
  };

  // 북마크 토글
  const handleToggleBookmark = async (postId: number) => {
    toggleBookmark(postId);
    await toggleBookmarkAsync(postId);
  };

  // 리트윗 토글
  const handleToggleRetweet = async (postId: number) => {
    toggleRetweet(postId);
    await toggleRetweetAsync(postId);
  };

  return {
    posts,
    loading: isLoading,
    isFetchingNextPage,
    isError,
    hasNextPage,
    observerTarget,
    handleToggleLike,
    handleToggleBookmark,
    handleToggleRetweet,
    handleSubmitPost,
  };
};

export default usePost;

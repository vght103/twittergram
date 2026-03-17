import { useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import {
  createPostAsync,
  fetchPostsAsync,
  toggleBookmarkAsync,
  toggleLikeAsync,
  toggleRetweetAsync,
} from "../api/feedApi";
import type { Post, PostRequest, PostsPage } from "../api/feed-type";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "react-router";

const LIMIT = 10;

// useInfiniteQuery 캐시에서 특정 포스트를 업데이트하는 유틸
const updatePostInCache = (
  old: InfiniteData<PostsPage> | undefined,
  postId: number,
  updater: (post: Post) => Post,
): InfiniteData<PostsPage> | undefined => {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      posts: page.posts.map((post) => (post.id === postId ? updater(post) : post)),
    })),
  };
};

// 낙관적 업데이트 mutation 팩토리
// mutationFn과 updater만 다르고 나머지(cancelQueries, 스냅샷, rollback)는 동일
const useOptimisticToggle = (
  mutationFn: (postId: number) => Promise<{ success: boolean }>,
  updater: (post: Post) => Post,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onMutate: async (postId: number) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousData = queryClient.getQueryData<InfiniteData<PostsPage>>(["posts"]);

      queryClient.setQueryData<InfiniteData<PostsPage>>(["posts"], (old) => updatePostInCache(old, postId, updater));

      return { previousData };
    },
    onError: (_err: unknown, _postId: number, context: { previousData?: InfiniteData<PostsPage> } | undefined) => {
      queryClient.setQueryData(["posts"], context?.previousData);
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["posts"] });
    // },
    // ⬆️ 실제 백엔드 연동 시 주석 해제 (서버 데이터로 재검증)
    // DummyJSON은 변경을 저장하지 않아서 재검증하면 원래 값으로 덮어씀
  });
};

const usePost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 로그인 유저 정보
  const { user } = useUserStore();

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
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  // 포스트 생성 - useMutation
  const createPostMutation = useMutation({
    mutationFn: (request: { content: string; images: string[] }) => {
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
      return createPostAsync(requestBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    },
  });

  // 토글 mutations - 팩토리로 생성
  const likeMutation = useOptimisticToggle(toggleLikeAsync, (post) => ({
    ...post,
    isLiked: !post.isLiked,
    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
  }));

  const bookmarkMutation = useOptimisticToggle(toggleBookmarkAsync, (post) => ({
    ...post,
    isBookmarked: !post.isBookmarked,
  }));

  const retweetMutation = useOptimisticToggle(toggleRetweetAsync, (post) => ({
    ...post,
    isRetweeted: !post.isRetweeted,
    retweets: post.isRetweeted ? post.retweets - 1 : post.retweets + 1,
  }));

  return {
    posts,
    loading: isLoading,
    isFetchingNextPage,
    isError,
    hasNextPage,
    observerTarget,
    handleToggleLike: (postId: number) => likeMutation.mutate(postId),
    handleToggleBookmark: (postId: number) => bookmarkMutation.mutate(postId),
    handleToggleRetweet: (postId: number) => retweetMutation.mutate(postId),
    handleSubmitPost: (request: { content: string; images: string[] }) => createPostMutation.mutate(request),
  };
};

export default usePost;

import { useEffect, useRef, useState } from "react";
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

const usePost = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { posts, createPosts, appendPosts, toggleLike, toggleBookmark, toggleRetweet } = usePostsStore();

  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !isLastPage) {
          getPostList();
        }
      },
      { rootMargin: "500px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, isLastPage, posts]); // page 제거

  // 게시글 목록 조회
  const getPostList = async () => {
    if (loading || isLastPage) return; // 로딩 중이거나 더 없으면 중단
    setLoading(true);

    try {
      const postList = await fetchPostsAsync(params);

      appendPosts(postList);

      setParams((prev) => ({ ...prev, page: prev.page + 1 }));

      // 데이터 개수가 제한보다 적으면 마지막 페이지
      setIsLastPage(postList.length !== params.limit);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

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
      createPosts(result.post);
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
    loading,
    isLastPage,
    observerTarget,
    getPostList,
    handleToggleLike,
    handleToggleBookmark,
    handleToggleRetweet,
    handleSubmitPost,
  };
};

export default usePost;

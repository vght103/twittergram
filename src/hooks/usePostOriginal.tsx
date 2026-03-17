import { useEffect, useRef, useState } from "react";
import {
  createPostAsync,
  fetchPostsAsync,
  toggleBookmarkAsync,
  toggleLikeAsync,
  toggleRetweetAsync,
} from "../api/feedApiOriginal";
import { usePostsStore } from "../stores/postsStore";
import type { PostRequest } from "../api/feed-type";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "react-router";

const usePostOriginal = () => {
  const navigate = useNavigate();

  const { user } = useUserStore();

  const {
    posts,
    createPosts,
    setPosts,
    toggleLike,
    toggleBookmark,
    toggleRetweet,
  } = usePostsStore();

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
  }, [loading, isLastPage, posts]);

  const getPostList = async () => {
    if (loading || isLastPage) return;
    setLoading(true);

    try {
      const postList = await fetchPostsAsync(params);

      setPosts(postList);
      setParams((prev) => ({ ...prev, page: prev.page + 1 }));

      setIsLastPage(postList.length !== params.limit);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (request: { content: string; images: string[] }) => {
    setLoading(true);
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
      navigate("/original");
    }
    setLoading(false);
  };

  const handleToggleLike = async (postId: number) => {
    toggleLike(postId);
    await toggleLikeAsync(postId);
  };

  const handleToggleBookmark = async (postId: number) => {
    toggleBookmark(postId);
    await toggleBookmarkAsync(postId);
  };

  const handleToggleRetweet = async (postId: number) => {
    toggleRetweet(postId);
    await toggleRetweetAsync(postId);
  };

  return {
    posts,
    loading,
    isLastPage,
    observerTarget,
    handleToggleLike,
    handleToggleBookmark,
    handleToggleRetweet,
    handleSubmitPost,
  };
};

export default usePostOriginal;

import { useState } from "react";
import type { Post } from "../api/feed-type";
import { fetchPostsAsync, toggleBookmarkAsync, toggleRetweetAsync } from "../api/feedApi";
import { toggleLikeAsync } from "../api/feedApi";

const usePost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  // 게시글 목록 조회
  const getPosts = async () => {
    if (loading || isLastPage) return; // 로딩 중이거나 더 없으면 중단
    setLoading(true);

    try {
      const postList = await fetchPostsAsync(params);

      setPosts((prev) => [...prev, ...postList]);

      setParams((prev) => ({ ...prev, page: prev.page + 1 }));

      // 데이터 개수가 제한보다 적으면 마지막 페이지
      setIsLastPage(postList.length !== params.limit);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 좋아요 토글
  const handleToggleLike = async (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
    await toggleLikeAsync(postId);
  };

  // 북마크 토글
  const handleToggleBookmark = async (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId //
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
    await toggleBookmarkAsync(postId);
  };

  // 리트윗 토글
  const handleToggleRetweet = async (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isRetweeted: !post.isRetweeted,
              retweets: post.isRetweeted ? post.retweets - 1 : post.retweets + 1,
            }
          : post
      )
    );

    await toggleRetweetAsync(postId);
  };

  return { posts, loading, isLastPage, getPosts, handleToggleLike, handleToggleBookmark, handleToggleRetweet };
};

export default usePost;

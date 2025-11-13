import { useEffect, useRef, useState } from "react";
import type { Post } from "../api/feed-type";
import { fetchPostsAsync } from "../api/feedApi";

const usePost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !isLastPage) {
          getPosts();
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

  return {
    posts,
    loading,
    isLastPage,
    observerTarget,
    getPosts,
  };
};

export default usePost;

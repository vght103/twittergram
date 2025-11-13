import { useEffect, useRef, useState } from "react";
import type { Post, PostRequest } from "../api/feed-type";
import {
  createPostAsync,
  fetchPostsAsync,
  toggleBookmarkAsync,
  toggleLikeAsync,
  toggleRetweetAsync,
} from "../api/feedApi";
import PostCard from "./PostCard";
import Spinner from "./Spinner";
import Modal from "./Modal";
import PostFormModal from "./PostFormModal";
import { useUserInfo } from "../context/userInfo";

type Props = {
  modalOpen: boolean;
  onClose: () => void;
};

const PostList = ({ modalOpen, onClose }: Props) => {
  const user = useUserInfo();

  const [posts, setPosts] = useState<Post[]>([]);

  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Observer 설정 - observerTarget이 보이면 loadMore 호출
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
  }, [loading, isLastPage]); // page 제거

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

  const onSubmitPost = async (request: { content: string; images: string[] }) => {
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
      setPosts((prev) => [result.post, ...prev]);
      onClose();
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

  return (
    <div className="w-full h-full max-w-xl mx-auto p-4">
      <ul>
        {posts.map((post) => (
          <li key={"post-" + post.id} className="my-6 ">
            <PostCard
              post={post}
              handleToggleLike={handleToggleLike}
              handleToggleBookmark={handleToggleBookmark}
              handleToggleRetweet={handleToggleRetweet}
            />
          </li>
        ))}
      </ul>

      {/* Observer 타겟 */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {loading && <Spinner />}
      </div>
      {modalOpen && (
        <Modal>
          <PostFormModal onSubmit={onSubmitPost} onClose={onClose} />
        </Modal>
      )}
    </div>
  );
};

export default PostList;

import mockPosts from "../data/posts.json";
import type { Post } from "./feed-type";

interface PostParams {
  page: number;
  limit: number;
}

// 포스트 목록 조회
export const fetchPostsAsync = async ({ page = 1, limit = 10 }: PostParams): Promise<Post[]> => {
  // 로컬 데이터에서 페이지네이션 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
  return mockPosts.slice((page - 1) * limit, page * limit);
};

// 포스트 생성 API

export const createPostAsync = async (post: Post): Promise<Post> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { ...post, id: mockPosts.length + 1 };
};

// 좋아요 토글 API
export const toggleLikeAsync = async (postId: number): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // 네트워크 지연 시뮬레이션
  console.log("좋아요 통신", postId);
  return { success: true };
};

// 북마크 토글 API
export const toggleBookmarkAsync = async (postId: number): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log("북마크 통신", postId);
  return { success: true };
};

// 리트윗 토글 API
export const toggleRetweetAsync = async (postId: number): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log("리트윗 통신", postId);
  return { success: true };
};

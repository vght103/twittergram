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

// 좋아요 토글
// export const toggleLike = async (postId: string) => {
//   await new Promise((resolve) => setTimeout(resolve, 300));
//   // 로컬 상태 업데이트
//   return { success: true };
// };

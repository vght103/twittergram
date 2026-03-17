import type { Post, PostRequest, DummyJsonPost, DummyJsonPostsResponse, PostsPage } from "./feed-type";

const BASE_URL = "https://dummyjson.com";

// DummyJSON 포스트 → Post 타입 변환
const toPost = (raw: DummyJsonPost): Post => ({
  id: raw.id,
  content: raw.body,
  images: [`https://picsum.photos/id/${raw.id % 100}/600/400`],
  author: {
    name: `User ${raw.userId}`,
    username: `user_${raw.userId}`,
    profileImage: `https://randomuser.me/api/portraits/men/${raw.userId % 99}.jpg`,
    verified: raw.userId % 3 === 0,
  },
  createdAt: new Date(Date.now() - raw.id * 3600000).toISOString(),
  likes: raw.reactions.likes,
  retweets: raw.views,
  comments: raw.reactions.dislikes,
  isLiked: false,
  isRetweeted: false,
  isBookmarked: false,
});

// 포스트 목록 조회 (페이지네이션)
export const fetchPostsAsync = async (skip = 0, limit = 10): Promise<PostsPage> => {
  const res = await fetch(`${BASE_URL}/posts?limit=${limit}&skip=${skip}`);
  const data: DummyJsonPostsResponse = await res.json();

  return {
    posts: data.posts.map(toPost),
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  };
};

// 포스트 생성 API
export const createPostAsync = async (post: PostRequest): Promise<{ post: Post }> => {
  const res = await fetch(`${BASE_URL}/posts/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: post.content.slice(0, 50),
      body: post.content,
      userId: 1,
    }),
  });
  const data = await res.json();

  const response: Post = {
    ...post,
    id: data.id,
    createdAt: new Date().toISOString(),
    likes: 0,
    retweets: 0,
    comments: 0,
    isLiked: false,
    isRetweeted: false,
    isBookmarked: false,
  };
  return { post: response };
};

// 좋아요 토글 API
export const toggleLikeAsync = async (postId: number): Promise<{ success: boolean }> => {
  await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "liked" }),
  });
  return { success: true };
};

// 북마크 토글 API
export const toggleBookmarkAsync = async (postId: number): Promise<{ success: boolean }> => {
  await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "bookmarked" }),
  });
  return { success: true };
};

// 리트윗 토글 API
export const toggleRetweetAsync = async (postId: number): Promise<{ success: boolean }> => {
  await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "retweeted" }),
  });
  return { success: true };
};

// 가상 스크롤용 - 전체 데이터 1회 호출 (JSONPlaceholder 5,000개)
export const fetchAllPhotosAsync = async (): Promise<Post[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=5000");
  const data: { albumId: number; id: number; title: string; url: string; thumbnailUrl: string }[] = await res.json();

  return data.map((photo) => ({
    id: photo.id,
    content: photo.title,
    images: [`https://picsum.photos/id/${photo.id % 1000}/600/400`],
    author: {
      name: `User ${photo.albumId}`,
      username: `user_${photo.albumId}`,
      profileImage: `https://randomuser.me/api/portraits/men/${photo.albumId % 99}.jpg`,
      verified: photo.albumId % 3 === 0,
    },
    createdAt: new Date(Date.now() - photo.id * 360000).toISOString(),
    likes: Math.floor(Math.random() * 500),
    retweets: Math.floor(Math.random() * 200),
    comments: Math.floor(Math.random() * 100),
    isLiked: false,
    isRetweeted: false,
    isBookmarked: false,
  }));
};

import { create } from "zustand";
import type { Post } from "../api/feed-type";

type PostsStore = {
  posts: Post[];
  createPosts: (newPosts: Post) => void;
  setPosts: (posts: Post[]) => void;
  toggleLike: (postId: number) => void;
  toggleBookmark: (postId: number) => void;
  toggleRetweet: (postId: number) => void;
};

export const usePostsStore = create<PostsStore>((set) => ({
  posts: [],

  // posts 추가
  createPosts: (newPost) =>
    set((state) => ({
      posts: [newPost, ...state.posts],
    })),

  // posts 조회 (무한 스크롤용)
  setPosts: (newPosts) =>
    set((state) => ({
      posts: [...state.posts, ...newPosts],
    })),

  // 좋아요 토글
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      ),
    })),

  // 북마크 토글
  toggleBookmark: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) => (post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post)),
    })),

  // 리트윗 토글
  toggleRetweet: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isRetweeted: !post.isRetweeted,
              retweets: post.isRetweeted ? post.retweets - 1 : post.retweets + 1,
            }
          : post
      ),
    })),
}));

export type Post = PostRequest & {
  id: number;
  createdAt: string; // 작성일
  likes: number; // 좋아요 수
  retweets: number; // 리트윗 수
  comments: number; // 댓글 수
  isLiked: boolean; // 좋아요 여부
  isRetweeted: boolean; // 리트윗 여부
  isBookmarked: boolean; // 북마크 여부
};

export interface PostRequest {
  author: {
    name: string; //
    username: string;
    profileImage: string;
    verified: boolean;
  };
  content: string; // 내용
  images: string[]; // 이미지 url
}

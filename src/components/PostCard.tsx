import dayjs from "dayjs";
import type { Post } from "../api/feed-type";
import ToggleActionBar from "./ToggleActionBar";

type Props = {
  post: Post;
  handleToggleLike: (postId: number) => void;
  handleToggleBookmark: (postId: number) => void;
  handleToggleRetweet: (postId: number) => void;
};

const PostCard = ({ post, handleToggleLike, handleToggleBookmark, handleToggleRetweet }: Props) => {
  return (
    // <section className="bg-white">
    <section className="rounded-lg shadow-lg  border border-gray-200 mb-3">
      {/* 작성자 헤더 */}
      <div className="flex items-center p-2 justify-between">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full border-2 border-amber-300 mr-1.5"
            src={post.author.profileImage}
            alt={post.author.name}
          />
          <p className="font-bold">{post.author.name}</p>
        </div>
        <p className="text-sm text-gray-500">{dayjs(post.createdAt).format("YYYY-MM-DD")}</p>
      </div>

      {/* 피드 내용 */}
      <div className="bg-white">
        {/* 메인 이미지 */}
        <div className="cursor-pointer">
          {post.images.length > 0 && ( //
            <div>
              <img className="w-full h-auto" src={post.images[0]} alt={post.content} />
            </div>
          )}
          {/* 피드 내용 */}
          <div className="px-2 py-4">
            <p>{post.content}</p>
          </div>
        </div>

        {/* 아이콘 section */}
        <ToggleActionBar
          post={post}
          handleToggleLike={handleToggleLike}
          handleToggleBookmark={handleToggleBookmark}
          handleToggleRetweet={handleToggleRetweet}
        />
      </div>
    </section>
  );
};

export default PostCard;

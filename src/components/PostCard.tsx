import type { Post } from "../api/feed-type";
import { getRelativeTime } from "../util/common-util";
import ToggleActionBar from "./ToggleActionBar";
import UserCard from "./UserCard";

type Props = {
  post: Post;
  handleToggleLike: (postId: number) => void;
  handleToggleBookmark: (postId: number) => void;
  handleToggleRetweet: (postId: number) => void;
};

const PostCard = ({
  post, //
  handleToggleLike,
  handleToggleBookmark,
  handleToggleRetweet,
}: Props) => {
  return (
    <section className="rounded-lg shadow-lg  border border-gray-200 mb-3">
      {/* 작성자 헤더 */}
      <UserCard userInfo={post.author} />

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

          <div className="px-2 py-4">
            <p className="text-sm text-gray-500">{getRelativeTime(post.createdAt)}</p>
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

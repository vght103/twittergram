import HeartIcon from "./icons/HeartIcon";
import BookmarkIcon from "./icons/BookmarkIcon";
import ToggleIcon from "./ToggleIcon";
import HeartFillIcon from "./icons/HeartFillIcon";
import BookmarkIconFill from "./icons/BookmarkIconFill";
import ReTweetIcon from "./icons/ReTweetIcon";
import ChatIcon from "./icons/ChatIcon";
import type { Post } from "../api/feed-type";

type Props = {
  post: Post;
  handleToggleLike: (postId: number) => void;
  handleToggleBookmark: (postId: number) => void;
  handleToggleRetweet: (postId: number) => void;
};

const ToggleActionBar = ({ post, handleToggleLike, handleToggleBookmark, handleToggleRetweet }: Props) => {
  return (
    <div className="flex items-center justify-around px-2 py-4">
      {/* 좋아요 */}
      <div className="flex items-center">
        <ToggleIcon
          toggled={post.isLiked}
          onToggle={<HeartFillIcon />}
          offToggle={<HeartIcon />}
          onClick={() => handleToggleLike(post.id)}
          count={post.likes}
        />
      </div>

      <div className="flex items-center">
        <ChatIcon />
        <p className="text-sm text-gray-500 ml-1">{post.comments}</p>
      </div>

      {/* 리트윗 */}
      <div className="flex items-center ">
        <ToggleIcon
          toggled={post.isRetweeted}
          onToggle={<ReTweetIcon className="text-green-500" />}
          offToggle={<ReTweetIcon />}
          onClick={() => handleToggleRetweet(post.id)}
          count={post.retweets}
        />
      </div>

      {/* 북마크 */}
      <ToggleIcon
        toggled={post.isBookmarked}
        onToggle={<BookmarkIconFill />}
        offToggle={<BookmarkIcon />}
        onClick={() => handleToggleBookmark(post.id)}
      />
    </div>
  );
};

export default ToggleActionBar;

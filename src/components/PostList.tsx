import usePost from "../hooks/usePost";
import PostCard from "./PostCard";
import Spinner from "./Spinner";

const PostList = () => {
  const { posts, observerTarget, loading } = usePost();
  return (
    <div className="w-full h-full max-w-xl mx-auto p-4">
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-10 ">
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      {/* Observer 타겟 */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default PostList;

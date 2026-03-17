import usePost from "../hooks/usePost";
import PostCard from "./PostCard";
import Spinner from "./Spinner";

const PostList = () => {
  const { posts, observerTarget, loading, isFetchingNextPage, isError, hasNextPage } = usePost();

  if (loading) {
    return (
      <div className="w-full h-full max-w-xl mx-auto p-4 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full max-w-xl mx-auto p-4 text-center text-red-500">
        피드를 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-xl mx-auto p-4">
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-10">
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      {/* Observer 타겟 */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-gray-400 text-sm">모든 피드를 불러왔습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PostList;

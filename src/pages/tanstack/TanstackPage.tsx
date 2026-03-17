import usePost from "../../hooks/usePost";
import PostCard from "../../components/PostCard";
import Spinner from "../../components/Spinner";

const TanstackPage = () => {
  const { posts, observerTarget, loading, isFetchingNextPage, isError, hasNextPage } = usePost();

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        피드를 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <p className="font-bold text-blue-800">TanStack Query 구현</p>
        <p className="text-blue-700">useInfiniteQuery + useInView 무한스크롤 / useMutation 낙관적 업데이트 (rollback 지원)</p>
      </div>

      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-10">
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-gray-400 text-sm">모든 피드를 불러왔습니다.</p>
        )}
      </div>
    </div>
  );
};

export default TanstackPage;

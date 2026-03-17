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
        <p className="font-bold text-blue-800">TanStack Query 구현 (무한 스크롤)</p>
        <p className="text-blue-700">useInfiniteQuery + useInView 무한스크롤 / useMutation 낙관적 업데이트 (rollback 지원)</p>
      </div>

      {/* 실시간 디버그 패널 */}
      <div className="sticky top-0 z-10 mb-2 p-3 bg-gray-900 text-white rounded-lg text-xs font-mono space-y-2">
        <div className="flex justify-between">
          <div>
            <span className="text-gray-400">로드된 데이터: </span>
            <span className="text-white font-bold">{posts.length}개</span>
          </div>
          <div>
            <span className="text-gray-400">DOM 노드: </span>
            <span className="text-red-400 font-bold">{posts.length}개 (전부 렌더링)</span>
          </div>
          <div>
            <span className="text-gray-400">API 호출: </span>
            <span className="text-yellow-400 font-bold">{Math.ceil(posts.length / 10)}회</span>
          </div>
        </div>
        <div className="pt-1 border-t border-gray-700">
          <span className="text-gray-400">특징: </span>
          <span className="text-red-400">스크롤할수록 DOM 노드가 계속 증가 (제거 안 됨)</span>
        </div>
      </div>

      <ul>
        {posts.map((post, index) => (
          <li key={post.id} className="relative mb-10">
            {/* DOM 노드 경계선 */}
            <div className="absolute -inset-1 border-2 border-dashed border-blue-400 rounded-xl pointer-events-none z-10" />
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg font-mono z-10">
              DOM #{index + 1}
            </div>
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

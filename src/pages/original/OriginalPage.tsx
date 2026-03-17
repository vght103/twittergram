import usePostOriginal from "../../hooks/usePostOriginal";
import PostCard from "../../components/PostCard";
import Spinner from "../../components/Spinner";

const OriginalPage = () => {
  const { posts, observerTarget, loading } = usePostOriginal();

  return (
    <div>
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
        <p className="font-bold text-yellow-800">Original 구현</p>
        <p className="text-yellow-700">useState + useRef + IntersectionObserver 직접 구현 / Zustand 낙관적 업데이트 (rollback 없음)</p>
      </div>

      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-10">
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default OriginalPage;

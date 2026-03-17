import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import usePostVirtual from "../../hooks/usePostVirtual";
import PostCard from "../../components/PostCard";
import Spinner from "../../components/Spinner";

const ESTIMATED_POST_HEIGHT = 500;

const VirtualPage = () => {
  const { posts, loading, isError, totalLoaded } = usePostVirtual();
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_POST_HEIGHT,
    overscan: 3,
  });

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

  // 현재 렌더링 중인 아이템 정보
  const virtualItems = virtualizer.getVirtualItems();
  const firstIndex = virtualItems[0]?.index ?? 0;
  const lastIndex = virtualItems[virtualItems.length - 1]?.index ?? 0;
  const scrollProgress = totalLoaded > 0 ? ((lastIndex + 1) / totalLoaded) * 100 : 0;

  return (
    <div>
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
        <p className="font-bold text-green-800">Virtual Scroll 구현</p>
        <p className="text-green-700">
          API 1회 호출로 {totalLoaded.toLocaleString()}개 로드 완료
        </p>
      </div>

      {/* 실시간 디버그 패널 */}
      <div className="sticky top-0 z-10 mb-2 p-3 bg-gray-900 text-white rounded-lg text-xs font-mono space-y-2">
        {/* 스크롤 진행률 바 */}
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0">스크롤</span>
          <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-400 h-full rounded-full transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <span className="w-12 text-right">{scrollProgress.toFixed(1)}%</span>
        </div>

        {/* 수치 정보 */}
        <div className="flex justify-between">
          <div>
            <span className="text-gray-400">전체 데이터: </span>
            <span className="text-white font-bold">{totalLoaded.toLocaleString()}개</span>
          </div>
          <div>
            <span className="text-gray-400">DOM 노드: </span>
            <span className="text-green-400 font-bold">{virtualItems.length}개</span>
          </div>
          <div>
            <span className="text-gray-400">현재 범위: </span>
            <span className="text-yellow-400 font-bold">#{firstIndex + 1} ~ #{lastIndex + 1}</span>
          </div>
        </div>

        {/* 비교 */}
        <div className="flex gap-4 pt-1 border-t border-gray-700">
          <div>
            <span className="text-gray-400">가상 스크롤 없이: </span>
            <span className="text-red-400">DOM {totalLoaded.toLocaleString()}개 전부 렌더링</span>
          </div>
          <div>
            <span className="text-gray-400">절감률: </span>
            <span className="text-green-400 font-bold">
              {totalLoaded > 0 ? ((1 - virtualItems.length / totalLoaded) * 100).toFixed(2) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollRef}
        className="h-[80vh] overflow-auto"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualItem) => {
            const post = posts[virtualItem.index];
            return (
              <div
                key={post.id}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {/* 아이템 인덱스 + DOM 노드 영역 표시 */}
                <div className="relative mb-10">
                  {/* DOM 노드 경계선 - 이 테두리 안이 실제 렌더링된 DOM 노드 1개 */}
                  <div className="absolute -inset-1 border-2 border-dashed border-green-400 rounded-xl pointer-events-none z-10" />
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg font-mono z-10">
                    DOM #{virtualItem.index + 1}
                  </div>
                  <PostCard post={post} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VirtualPage;

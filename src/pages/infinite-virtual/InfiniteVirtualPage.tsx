import { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import usePostInfiniteVirtual from "../../hooks/usePostInfiniteVirtual";
import PostCard from "../../components/PostCard";
import Spinner from "../../components/Spinner";

const ESTIMATED_POST_HEIGHT = 500;

const InfiniteVirtualPage = () => {
  const { posts, loading, isError, hasNextPage, isFetchingNextPage, fetchNextPage, totalLoaded } =
    usePostInfiniteVirtual();

  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_POST_HEIGHT,
    overscan: 3,
  });

  // 마지막 아이템이 보이면 다음 페이지 로드 (무한 스크롤 트리거)
  const virtualItems = virtualizer.getVirtualItems();
  const lastItem = virtualItems[virtualItems.length - 1];

  useEffect(() => {
    if (!lastItem) return;
    // 마지막 렌더링된 아이템이 전체 데이터의 끝에 가까우면 다음 페이지 로드
    if (lastItem.index >= posts.length - 3 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [lastItem?.index, posts.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  const firstIndex = virtualItems[0]?.index ?? 0;
  const lastIndex = virtualItems[virtualItems.length - 1]?.index ?? 0;

  return (
    <div>
      <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
        <p className="font-bold text-purple-800">Infinite + Virtual Scroll 조합</p>
        <p className="text-purple-700">
          useInfiniteQuery (점진 로딩) + useVirtualizer (DOM 최소화)
        </p>
      </div>

      {/* 실시간 디버그 패널 */}
      <div className="sticky top-0 z-10 mb-2 p-3 bg-gray-900 text-white rounded-lg text-xs font-mono space-y-2">
        <div className="flex justify-between">
          <div>
            <span className="text-gray-400">로드된 데이터: </span>
            <span className="text-white font-bold">{totalLoaded}개</span>
            {hasNextPage && <span className="text-yellow-400 ml-1">(추가 로딩 가능)</span>}
            {!hasNextPage && <span className="text-green-400 ml-1">(전부 로드)</span>}
          </div>
          <div>
            <span className="text-gray-400">DOM 노드: </span>
            <span className="text-purple-400 font-bold">{virtualItems.length}개</span>
          </div>
          <div>
            <span className="text-gray-400">범위: </span>
            <span className="text-yellow-400 font-bold">#{firstIndex + 1} ~ #{lastIndex + 1}</span>
          </div>
        </div>
        <div className="flex gap-4 pt-1 border-t border-gray-700">
          <div>
            <span className="text-gray-400">API 호출: </span>
            <span className="text-yellow-400 font-bold">{Math.ceil(totalLoaded / 10)}회</span>
            <span className="text-gray-500"> (10개씩 점진 로딩)</span>
          </div>
          <div>
            <span className="text-gray-400">전략: </span>
            <span className="text-purple-400">필요한 만큼만 fetch + 보이는 것만 렌더</span>
          </div>
        </div>
      </div>

      {/* 스크롤 컨테이너 */}
      <div ref={scrollRef} className="h-[80vh] overflow-auto">
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
                <div className="relative mb-10">
                  <div className="absolute -inset-1 border-2 border-dashed border-purple-400 rounded-xl pointer-events-none z-10" />
                  <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg font-mono z-10">
                    DOM #{virtualItem.index + 1}
                  </div>
                  <PostCard post={post} />
                </div>
              </div>
            );
          })}
        </div>

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteVirtualPage;

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import usePostVirtual from "../../hooks/usePostVirtual";
import PostCard from "../../components/PostCard";
import Spinner from "../../components/Spinner";

// PostCard의 예상 높이 (px)
// 실제 렌더링 전에는 정확한 높이를 모르므로 추정값을 사용
// 이후 measureElement로 실제 높이를 측정하여 자동 보정됨
const ESTIMATED_POST_HEIGHT = 500;

const VirtualPage = () => {
  // useQuery로 5,000개 데이터를 1회 API 호출로 전부 가져옴
  const { posts, loading, isError, totalLoaded } = usePostVirtual();

  // 스크롤 컨테이너 ref
  // useVirtualizer가 이 요소의 스크롤 위치를 감시하여
  // 현재 화면에 보여야 할 아이템을 계산함
  const scrollRef = useRef<HTMLDivElement>(null);

  // 가상화 인스턴스 생성
  const virtualizer = useVirtualizer({
    count: posts.length, // 전체 아이템 수 (5,000개)
    getScrollElement: () => scrollRef.current, // 스크롤을 감시할 DOM 요소
    estimateSize: () => ESTIMATED_POST_HEIGHT, // 각 아이템의 예상 높이 (스크롤바 계산용)
    overscan: 3, // 화면 밖에 미리 렌더링할 아이템 수 (스크롤 시 깜빡임 방지)
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

  return (
    <div>
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
        <p className="font-bold text-green-800">Virtual Scroll 구현</p>
        <p className="text-green-700">
          API 1회 호출로 {totalLoaded.toLocaleString()}개 로드 완료 |
          DOM 노드: {virtualizer.getVirtualItems().length}개만 렌더링
        </p>
      </div>

      {/*
        스크롤 컨테이너 (고정 높이 필수)
        - h-[80vh]: 뷰포트의 80% 높이로 고정
        - overflow-auto: 내부 콘텐츠가 넘치면 스크롤 생성
        - 이 요소의 스크롤 이벤트를 virtualizer가 감시함
      */}
      <div
        ref={scrollRef}
        className="h-[80vh] overflow-auto"
      >
        {/*
          전체 높이 확보용 래퍼
          - getTotalSize(): 5,000개 × 예상 높이 = 전체 스크롤 영역 높이
          - 이 높이 덕분에 스크롤바가 5,000개분의 전체 길이로 표시됨
          - position: relative → 자식 아이템들이 absolute로 위치 잡을 기준점
        */}
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {/*
            getVirtualItems(): 현재 화면에 보여야 할 아이템만 반환
            - 스크롤 위치에 따라 자동으로 계산됨
            - 예: 5,000개 중 화면에 보이는 3개 + overscan 3개 = ~6개만 반환
          */}
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const post = posts[virtualItem.index];
            return (
              <div
                key={post.id}
                data-index={virtualItem.index} // virtualizer가 아이템을 식별하는 데 사용
                ref={virtualizer.measureElement} // 실제 렌더링된 높이를 측정 → estimateSize 보정
                style={{
                  position: "absolute", // 일반 flow에서 빠져나와 독립적으로 위치
                  top: 0,
                  left: 0,
                  width: "100%",
                  // virtualItem.start: 이 아이템의 시작 y좌표 (px)
                  // translateY로 정확한 스크롤 위치에 배치
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="mb-10">
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

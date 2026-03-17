# Twittergram 구현 계획서

## 현재 상태 요약

| 기능 | 현재 구현 방식 | 문제점 |
|------|---------------|--------|
| 피드 조회 | `usePost` 훅 + `useState` + `IntersectionObserver` 직접 구현 | 캐싱 없음, 상태 관리 복잡 |
| 무한 스크롤 | 수동 `IntersectionObserver` + `page/limit` state | 중복 요청 방지 로직 수동 관리 |
| 낙관적 업데이트 | Zustand store 동기 변경 → API 호출 | rollback 없음, API 실패 시 UI 불일치 |
| 서버 상태 관리 | Zustand (서버/클라이언트 상태 혼재) | 캐싱, 재검증, 에러 처리 부재 |
| 데이터 소스 | 로컬 JSON import + setTimeout | 네트워크 탭에 안 찍힘, 실제 HTTP 통신 아님 |

---

## 사용할 Public API

### 피드 데이터: DummyJSON `/posts`

| 항목 | 내용 |
|------|------|
| Base URL | `https://dummyjson.com/posts` |
| 페이지네이션 | `?limit=10&skip=0` (offset 기반) |
| 총 아이템 수 | 251개 |
| 응답에 total 포함 | **Yes** (`{ posts: [...], total: 251, skip: 0, limit: 10 }`) |
| API Key | 불필요 |

**응답 형태:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "His mother had always taught him",
      "body": "His mother had always taught him not to ever think...",
      "tags": ["history", "american", "crime"],
      "reactions": { "likes": 192, "dislikes": 25 },
      "views": 305,
      "userId": 121
    }
  ],
  "total": 251,
  "skip": 0,
  "limit": 10
}
```

### 이미지: Picsum Photos (URL 매핑)

별도 API 호출 없이, post.id를 기반으로 이미지 URL 생성:
```
https://picsum.photos/id/${post.id % 100}/600/400
```

### 아바타: Random User (URL 매핑)

별도 API 호출 없이, userId를 기반으로 아바타 URL 생성:
```
https://randomuser.me/api/portraits/men/${post.userId % 99}.jpg
```

### 가상 스크롤용 대량 데이터: JSONPlaceholder `/photos`

| 항목 | 내용 |
|------|------|
| Base URL | `https://jsonplaceholder.typicode.com/photos` |
| 페이지네이션 | `?_start=0&_limit=50` (offset 기반) |
| 총 아이템 수 | **5,000개** |
| API Key | 불필요 |

**응답 형태:**
```json
{
  "albumId": 1,
  "id": 1,
  "title": "accusamus beatae ad facilis cum similique qui sunt",
  "url": "https://via.placeholder.com/600/92c952",
  "thumbnailUrl": "https://via.placeholder.com/150/92c952"
}
```

---

## Phase 1: TanStack Query 세팅 ✅

### 1-1. 기본 세팅 ✅ (완료)

- [x] `@tanstack/react-query`, `@tanstack/react-query-devtools` 설치
- [x] `src/lib/queryClient.ts` — QueryClient 인스턴스 생성
- [x] `src/main.tsx` — QueryClientProvider + ReactQueryDevtools 래핑

---

## Phase 2: 실제 API 통신으로 전환

### 2-1. API 레이어 교체

**현재 문제:** `feedApi.ts`가 로컬 JSON을 import하고 setTimeout으로 지연 → 네트워크 탭에 안 찍힘

**변경 내용:**
- `feedApi.ts`를 실제 `fetch()` 호출로 교체
- DummyJSON `/posts` API 사용
- 응답 데이터를 기존 `Post` 타입에 맞게 변환 (adapter 패턴)

**데이터 매핑 (DummyJSON → Post):**

| DummyJSON 필드 | → | Post 필드 |
|---------------|---|----------|
| `id` | → | `id` |
| `body` | → | `content` |
| `reactions.likes` | → | `likes` |
| `views` | → | `retweets` (대체 사용) |
| `tags` | → | (추가 가능) |
| `userId` | → | `author.name`, `author.profileImage` (매핑) |
| - | → | `images[]` (Picsum URL 생성) |
| - | → | `isLiked`, `isRetweeted`, `isBookmarked` (기본 false) |

**변경 파일:**
- `src/api/feedApi.ts` — fetch() 기반으로 전면 교체
- `src/api/feed-type.ts` — DummyJSON 응답 타입 추가

**useQuery 훅 적용:**
- `src/hooks/usePostsQuery.ts` — useQuery로 첫 페이지 조회 (이미 생성됨)
- 컴포넌트에서 `usePostsQuery()` 사용하여 네트워크 탭에서 실제 요청 확인

---

## Phase 3: 무한 스크롤 (`useInfiniteQuery`)

### 3-1. useInfiniteQuery 적용

**현재:** `usePost.tsx:30-72` — useState + IntersectionObserver 수동 관리

**변경 후:**
```ts
useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam = 0 }) =>
    fetch(`https://dummyjson.com/posts?limit=10&skip=${pageParam}`)
      .then(res => res.json()),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => {
    const nextSkip = lastPage.skip + lastPage.limit;
    return nextSkip < lastPage.total ? nextSkip : undefined;
  },
})
```

**이점:**
- `loading`, `isLastPage`, `page` state 전부 제거
- `hasNextPage`, `fetchNextPage`, `isFetchingNextPage` 자동 제공
- DummyJSON의 `total` 필드로 정확한 마지막 페이지 감지
- 캐싱으로 뒤로가기 시 즉시 렌더링

**IntersectionObserver 연동:**
- `react-intersection-observer` 패키지 활용 (이미 설치됨, 현재 미사용)
```ts
const { ref, inView } = useInView({ rootMargin: "500px" });

useEffect(() => {
  if (inView && hasNextPage) fetchNextPage();
}, [inView, hasNextPage]);
```

**변경 파일:**
- `src/hooks/usePost.tsx` — useInfiniteQuery + useInView로 전면 교체
- `src/components/PostList.tsx` — `pages.flatMap()` 으로 데이터 접근
- `src/stores/postsStore.ts` — `posts[]`, `setPosts` 제거

---

## Phase 4: 가상 스크롤 (`@tanstack/react-virtual`)

### 4-1. 대량 데이터 API 추가

JSONPlaceholder `/photos` API 사용 (5,000개 아이템):
```ts
fetch(`https://jsonplaceholder.typicode.com/photos?_start=${skip}&_limit=50`)
```

또는 DummyJSON 251개를 반복 로딩하여 1,000개+ 시뮬레이션.

### 4-2. useVirtualizer 적용

**설치 패키지:**
```bash
pnpm add @tanstack/react-virtual
```

**구현 방식:**
```ts
const virtualizer = useVirtualizer({
  count: allPosts.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 400,  // PostCard 예상 높이
  overscan: 5,
})
```

**핵심 포인트:**
- `useInfiniteQuery` + `useVirtualizer` 조합
- 화면에 보이는 PostCard만 DOM에 렌더링 (+ overscan 5개)
- 1,000개 이상의 포스트도 부드러운 스크롤
- 스크롤 끝 도달 시 `fetchNextPage` 자동 트리거

**성능 비교 목표:**
- 일반 무한 스크롤: 1,000개 렌더링 시 DOM 노드 수천 개 → 버벅임
- 가상 스크롤: 1,000개 데이터지만 DOM 노드 ~15개 → 부드러움

**변경 파일:**
- `src/api/feedApi.ts` — JSONPlaceholder API 추가
- `src/components/PostList.tsx` — virtualizer 적용
- PostCard 높이 측정 로직 추가

---

## 구현 순서 및 체크리스트

### Phase 1: TanStack Query 세팅 ✅
- [x] 1-1. 패키지 설치 + QueryClientProvider + devtools

### Phase 2: 실제 API 통신
- [ ] 2-1. `feedApi.ts` → DummyJSON fetch() 기반으로 교체
- [ ] 2-2. 데이터 매핑 (DummyJSON → Post 타입)
- [ ] 2-3. `usePostsQuery` 훅으로 네트워크 탭 확인

### Phase 3: 무한 스크롤
- [ ] 3-1. `useInfiniteQuery` 적용
- [ ] 3-2. `react-intersection-observer`로 스크롤 감지
- [ ] 3-3. PostList 컴포넌트 `pages.flatMap()` 적용
- [ ] 3-4. 기존 수동 스크롤 로직 제거

### Phase 4: 가상 스크롤
- [ ] 4-1. `@tanstack/react-virtual` 설치
- [ ] 4-2. 대량 데이터 API 연동 (1,000개+)
- [ ] 4-3. `useVirtualizer` + `useInfiniteQuery` 조합
- [ ] 4-4. 성능 비교 (일반 vs 가상 스크롤)

---

## 파일 변경 영향도

| 파일 | Phase 2 | Phase 3 | Phase 4 |
|------|---------|---------|---------|
| `src/api/feedApi.ts` | fetch() 교체 | - | 대량 API 추가 |
| `src/api/feed-type.ts` | DummyJSON 타입 추가 | - | - |
| `src/hooks/usePostsQuery.ts` | useQuery 적용 | useInfiniteQuery로 변경 | - |
| `src/hooks/usePost.tsx` | - | 전면 재작성 | - |
| `src/stores/postsStore.ts` | - | 서버 상태 제거 | - |
| `src/components/PostList.tsx` | - | flatMap 적용 | virtualizer 적용 |
| `src/main.tsx` | ✅ 완료 | - | - |
| `src/lib/queryClient.ts` | ✅ 완료 | - | - |

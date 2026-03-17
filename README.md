# 소셜미디어 피드 프론트엔드

트위터/인스타그램과 유사한 소셜 미디어 피드 서비스입니다.
다양한 스크롤 방식과 상태 관리 패턴을 비교 학습할 수 있는 프로젝트입니다.

## 실행 방법

### node 버전

```bash
v22.12.0 이상
```

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173)을 엽니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7 |
| 상태 관리 | Zustand v5 (클라이언트) / TanStack Query v5 (서버) |
| 스타일링 | Tailwind CSS v4 |
| 가상 스크롤 | @tanstack/react-virtual |
| 스크롤 감지 | react-intersection-observer |
| 유틸리티 | dayjs, react-icons |

## 4가지 구현 방식 비교

사이드바에서 각 페이지를 전환하며 비교할 수 있습니다.

### 1. Original (`/original`)

기존 직접 구현 방식.

- `useState` + `useRef` + `IntersectionObserver` 직접 구현
- Zustand store로 서버/클라이언트 상태 혼재 관리
- 낙관적 업데이트 (rollback 없음)
- 데이터 소스: 로컬 JSON + setTimeout

### 2. TanStack Query (`/tanstack`)

TanStack Query 기반 무한 스크롤.

- `useInfiniteQuery` + `react-intersection-observer`
- `useMutation` 낙관적 업데이트 (onError rollback 지원)
- 캐싱, 재검증, 에러 처리 자동화
- 데이터 소스: DummyJSON API (실제 HTTP 통신)
- **특징**: 스크롤할수록 DOM 노드 계속 누적

### 3. Virtual Scroll (`/virtual`)

가상 스크롤 단독 사용.

- `useQuery` 1회 호출로 5,000개 전체 로드 (JSONPlaceholder API)
- `useVirtualizer`로 화면에 보이는 ~6개만 DOM 렌더링
- DOM 절감률 99.88%
- **특징**: 스크롤바가 5,000개분 전체 높이를 반영

### 4. Infinite + Virtual (`/infinite-virtual`)

무한 스크롤 + 가상 스크롤 조합. **실무 최적 패턴.**

- `useInfiniteQuery`로 10개씩 점진 로딩
- `useVirtualizer`로 DOM은 항상 ~6개 유지
- 네트워크 부담 최소 + DOM 부담 최소
- **특징**: 데이터가 늘어나도 DOM 수 고정, 스크롤 UX 자연스러움

### 방식별 비교 요약

| | 데이터 로딩 | DOM 렌더링 | API 호출 | 스크롤 UX |
|---|---|---|---|---|
| Original | 로컬 JSON | 전부 누적 | 없음 (로컬) | 자연스러움 |
| TanStack | 10개씩 점진 | 전부 누적 | 스크롤 시 추가 | 자연스러움 |
| Virtual | 5,000개 한번에 | ~6개 고정 | 1회 | 스크롤바 작음 |
| **Inf + Virt** | **10개씩 점진** | **~6개 고정** | **스크롤 시 추가** | **자연스러움** |

## 사용한 Public API

| API | 용도 | URL |
|-----|------|-----|
| DummyJSON | 포스트 데이터 (251개) | `https://dummyjson.com/posts` |
| JSONPlaceholder | 대량 데이터 (5,000개) | `https://jsonplaceholder.typicode.com/photos` |
| Picsum Photos | 포스트 이미지 | `https://picsum.photos/id/{id}/600/400` |
| Random User | 아바타 이미지 | `https://randomuser.me/api/portraits/men/{id}.jpg` |

## 기술적 고민과 해결 과정

### 1. 서버 상태 vs 클라이언트 상태 분리

**문제점**: Zustand에 서버 상태(피드 목록, 좋아요)와 클라이언트 상태(UI, 로그인)가 혼재

**해결**: TanStack Query 도입으로 역할 분리
- Zustand → 클라이언트 상태만 (로그인 유저 정보)
- TanStack Query → 서버 상태 전담 (피드, 좋아요, 북마크 등)

### 2. 낙관적 업데이트 rollback 부재

**문제점**: 기존 방식은 store를 먼저 변경하고 API 호출 → API 실패 시 UI 불일치

**해결**: `useMutation`의 `onMutate`/`onError` 패턴 적용
- `onMutate`: 캐시 스냅샷 저장 → 즉시 UI 반영
- `onError`: 스냅샷으로 rollback
- 3개 토글(좋아요/북마크/리트윗)의 공통 로직을 `useOptimisticToggle` 팩토리로 추출

### 3. DOM 누적으로 인한 성능 저하

**문제점**: 무한 스크롤로 수백 개 포스트 로드 시 DOM 노드 누적 → 렌더링 성능 저하

**해결**: `@tanstack/react-virtual`로 가상 스크롤 적용
- 화면에 보이는 아이템만 DOM에 렌더링 (~6개)
- `estimateSize`로 초기 높이 추정, `measureElement`로 실제 높이 보정
- 무한 스크롤과 조합하여 네트워크 + DOM 최적화 동시 달성

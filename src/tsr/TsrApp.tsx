import { useEffect, useState } from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  useNavigate,
  stripSearchParams,
} from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchCharacters } from "../api/characterApi";
import Spinner from "../components/Spinner";

// TanStack Router Case — /search-params 와 같은 화면을 타입 있는 검색 파라미터로 구현

// ① 검색 파라미터의 "모양"을 타입으로 먼저 선언한다.
//    react-router 에는 이 단계가 없다 — 거기선 전부 string 이다.
type CharacterSearch = {
  q: string;
  status: string;
  species: string;
  gender: string;
  page: number; // ← 진짜 number 다
};

const FILTERS = [
  { key: "status", label: "상태", options: ["alive", "dead", "unknown"] },
  { key: "species", label: "종족", options: ["Human", "Alien", "Humanoid", "Robot", "Animal"] },
  { key: "gender", label: "성별", options: ["male", "female", "genderless"] },
] as const;

const STATUS_COLOR: Record<string, string> = {
  Alive: "bg-emerald-500",
  Dead: "bg-rose-500",
  unknown: "bg-gray-300",
};

/** URL 의 아무 문자열이나 들어와도 여기서 걸러진다. 통과하면 타입이 보장된다. */
const asText = (v: unknown) => (typeof v === "string" ? v : "");

/** 기본값. 이 값과 같으면 URL 에서 지워진다 (아래 stripSearchParams) */
const DEFAULTS: CharacterSearch = { q: "", status: "", species: "", gender: "", page: 1 };

const PER_PAGE = 20;

const rootRoute = createRootRoute();

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",

  // ② 관문(validateSearch). URL -> 타입 있는 객체로 바꾸는 단 하나의 통로다.
  //    ?page=abc 같은 쓰레기가 들어와도 여기서 1 로 정리된다.
  validateSearch: (search: Record<string, unknown>): CharacterSearch => ({
    q: asText(search.q),
    status: asText(search.status),
    species: asText(search.species),
    gender: asText(search.gender),
    page: Math.max(1, Number(search.page) || 1),
  }),

  // ③ 기본값과 같은 파라미터는 URL 에서 지운다.
  //    react-router 에서 next.delete(key) 로 손수 짰던 것을 API 하나로 대체한다.
  search: {
    middlewares: [stripSearchParams(DEFAULTS)],
  },

  component: TsrSearchPage,
});

const routeTree = rootRoute.addChildren([searchRoute]);

const tsrRouter = createRouter({ routeTree, basepath: "/tsr" });

// ④ 이 선언이 있어야 useSearch / navigate 가 타입을 알아본다
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof tsrRouter;
  }
}

function TsrSearchPage() {
  // ⑤ 읽기 — .get("q") 가 아니라 구조 분해. page 는 이미 number 다
  const { q, status, species, gender, page } = searchRoute.useSearch();
  const navigate = useNavigate({ from: "/" });

  // ⑥ 쓰기 — 문자열 조립이 없다. 객체를 그대로 넘긴다
  const setSearch = (patch: Partial<CharacterSearch>, replace = false) =>
    navigate({
      // 조건이 바뀌면 page 를 1 로 되돌린다
      search: (prev) => ({ ...prev, ...patch, page: 1 }),
      replace,
    });

  // prev.page 가 number 라서 그냥 더할 수 있다.
  // react-router 였다면 Number(searchParams.get("page")) 를 먼저 거쳐야 한다.
  const movePage = (delta: number) =>
    navigate({ search: (prev) => ({ ...prev, page: prev.page + delta }) });

  // 검색어 debounce — react-router 버전과 완전히 같은 패턴
  const [text, setText] = useState(q);

  useEffect(() => {
    setText(q);
  }, [q]);

  useEffect(() => {
    if (text === q) return;
    const timer = setTimeout(() => setSearch({ q: text }, true), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["characters", { q, status, species, gender }],
    queryFn: () => fetchCharacters({ q, status, species, gender }),
    placeholderData: keepPreviousData,
  });

  const characters = data?.characters ?? [];
  const pageCount = Math.max(1, Math.ceil(characters.length / PER_PAGE));
  const visible = characters.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasCondition = Boolean(q || status || species || gender) || page > 1;

  return (
    <div className="mx-auto max-w-xl p-4 pb-20">
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
        <p className="font-bold text-amber-800">TanStack Router 구현</p>
        <p className="text-amber-700">
          같은 화면을 validateSearch 스키마로 구현 / 검색 파라미터에 타입이 붙는다
        </p>
        <a href="/search-params" className="mt-1 inline-block text-amber-900 underline">
          ← react-router 버전과 비교하기
        </a>
      </div>

      {/* 디버그 패널 — 여기가 두 구현의 차이가 드러나는 자리 */}
      <div className="sticky top-0 z-10 mb-3 rounded-lg bg-gray-900 p-3 font-mono text-xs text-white">
        <div className="mb-2 h-0.5 overflow-hidden rounded-full bg-gray-700">
          <div className={`h-full bg-amber-400 transition-all ${isFetching ? "w-full animate-pulse" : "w-0"}`} />
        </div>
        <p className="break-all">
          <span className="text-gray-400">URL: </span>
          <span className="text-amber-300">{location.search || "(비어 있음)"}</span>
        </p>
        <p className="mt-1.5 border-t border-gray-700 pt-1.5">
          <span className="text-gray-400">typeof page: </span>
          <span className="font-bold text-emerald-400">{typeof page}</span>
          <span className="text-gray-500"> ← react-router 는 "string"</span>
        </p>
        <p className="mt-1 text-gray-400">
          조건 일치 <span className="font-bold text-white">{(data?.totalCount ?? 0).toLocaleString()}</span>명 / 불러온{" "}
          <span className="font-bold text-white">{characters.length}</span>명 중 {page}페이지 표시
        </p>
      </div>

      <div className="relative mb-3">
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="이름 검색 (예: rick, morty, beth)"
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-20 text-sm outline-none focus:border-amber-500"
        />
        {text !== q && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-amber-600">대기중…</span>
        )}
      </div>

      <div className="mb-3 space-y-2 rounded-xl border border-gray-100 bg-white p-3">
        {FILTERS.map(({ key, label, options }) => {
          const selected = { status, species, gender }[key];
          return (
            <div key={key} className="flex items-start gap-2">
              <span className="w-9 shrink-0 pt-1.5 text-xs text-gray-400">{label}</span>
              <div className="flex flex-wrap gap-1.5">
                {options.map((option) => {
                  const isActive = selected === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setSearch({ [key]: isActive ? "" : option })}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        isActive
                          ? "border-amber-600 bg-amber-600 text-white"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {hasCondition && (
        <button
          onClick={() => navigate({ search: { q: "", status: "", species: "", gender: "", page: 1 } })}
          className="mb-3 text-xs text-amber-700 underline underline-offset-2"
        >
          조건 초기화
        </button>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 py-10 text-center">
          <p className="text-sm text-red-600">{error instanceof Error ? error.message : "오류가 발생했습니다."}</p>
          <button onClick={() => refetch()} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white">
            다시 시도
          </button>
        </div>
      ) : characters.length === 0 ? (
        <p className="rounded-xl border border-gray-100 bg-white py-16 text-center text-sm text-gray-500">
          조건에 맞는 캐릭터가 없습니다.
        </p>
      ) : (
        <ul className={`space-y-2 transition-opacity ${isFetching ? "opacity-40" : ""}`}>
          {visible.map((character, index) => (
            <li key={character.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
              <span className="w-6 text-right font-mono text-[11px] text-gray-300">{(page - 1) * PER_PAGE + index + 1}</span>
              <img src={character.image} alt="" loading="lazy" className="h-14 w-14 rounded-xl bg-gray-100" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{character.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[character.status]}`} />
                  {character.status} · {character.species} · {character.gender}
                </p>
                <p className="truncate text-xs text-gray-400">{character.location.name}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && !isError && characters.length > 0 && pageCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => movePage(-1)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 disabled:opacity-40"
          >
            이전
          </button>
          <span className="px-2 font-mono text-xs text-gray-500">
            {page} / {pageCount}
          </span>
          <button
            disabled={page >= pageCount}
            onClick={() => movePage(1)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

const TsrApp = () => <RouterProvider router={tsrRouter} />;

export default TsrApp;

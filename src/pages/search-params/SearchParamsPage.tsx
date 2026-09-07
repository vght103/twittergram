import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchCharacters, type CharacterFilters } from "../../api/characterApi";
import Spinner from "../../components/Spinner";

// useSearchParams Case — 검색어/필터를 URL 에 저장한다

const FILTERS = [
  { key: "status", label: "상태", options: ["alive", "dead", "unknown"], multi: true },
  { key: "species", label: "종족", options: ["Human", "Alien", "Humanoid", "Robot", "Animal"] },
  { key: "gender", label: "성별", options: ["male", "female", "genderless"] },
] as const;

const STATUS_COLOR: Record<string, string> = {
  Alive: "bg-emerald-500",
  Dead: "bg-rose-500",
  unknown: "bg-gray-300",
};

const SearchParamsPage = () => {
  // ① URL 이 이 화면의 상태 저장소. useState 로 사본을 두지 않는다
  const [searchParams, setSearchParams] = useSearchParams();
  // ② 읽기 — URL -> 검색 조건
  const filters: CharacterFilters = {
    q: searchParams.get("q") ?? "",
    // 복수 선택이므로 get 이 아니라 getAll. get 은 첫 번째 값만 준다
    status: searchParams.getAll("status"),
    species: searchParams.get("species") ?? "",
    gender: searchParams.get("gender") ?? "",
  };

  // ③ 쓰기 — 값이 비면 파라미터를 지운다. replace=true 면 히스토리를 쌓지 않는다
  const setParam = (key: string, value: string, replace = false) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);

        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace },
    );
  };

  /**
   * 필터 토글. 단일/복수를 한 함수에서 처리한다.
   *
   * 복수일 때 set 을 쓸 수 없는 이유:
   *   set 은 그 키에 붙은 값을 "전부 지우고" 새로 하나 넣는다.
   *   그래서 전부 delete 한 뒤 남길 값들을 append 로 다시 붙인다.
   */
  const toggleFilter = (key: string, value: string, multi = false) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (!multi) {
        // 단일 — 같은 값을 다시 누르면 해제
        if (next.get(key) === value) next.delete(key);
        else next.set(key, value);
        return next;
      }

      const current = next.getAll(key);
      const updated = current.includes(value)
        ? current.filter((v) => v !== value) // 이미 있으면 빼고
        : [...current, value]; // 없으면 더하고

      next.delete(key); // 같은 키를 통째로 비운 뒤
      updated.forEach((v) => next.append(key, v)); // 하나씩 다시 붙인다

      return next;
    });
  };

  // ④ 검색어 debounce — 입력창은 즉시 반응하고, URL 은 400ms 뒤에 따라간다
  const [text, setText] = useState(filters.q);

  useEffect(() => {
    setText(filters.q); // 뒤로가기/초기화로 URL 이 바뀌면 입력창도 맞춘다
  }, [filters.q]);

  // debounce
  useEffect(() => {
    if (text === filters.q) return; // 같으면 아무것도 안 함 (무한 루프 방지)
    const timer = setTimeout(() => setParam("q", text, true), 400);
    return () => clearTimeout(timer);
    // text 가 바뀔 때만 타이머를 다시 건다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // ⑤ URL 이 바뀌면 queryKey 가 바뀌어 자동으로 다시 불러온다
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["characters", filters],
    queryFn: () => fetchCharacters(filters),
    placeholderData: keepPreviousData, // 조건 바뀌는 동안 화면이 비지 않게
  });

  const characters = data?.characters ?? [];
  const hasCondition = searchParams.toString() !== "";

  return (
    <div>
      <div className="mb-4 rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm">
        <p className="font-bold text-violet-800">useSearchParams 구현</p>
        <p className="text-violet-700">검색어와 필터가 URL 에 저장됩니다. 새로고침·뒤로가기·링크 공유로 복원돼요</p>
      </div>

      {/* 지금 URL 에 뭐가 실려 있는지 그대로 보여주는 패널 */}
      <div className="sticky top-0 z-10 mb-3 rounded-lg bg-gray-900 p-3 font-mono text-xs text-white">
        <div className="mb-2 h-0.5 overflow-hidden rounded-full bg-gray-700">
          <div className={`h-full bg-violet-400 transition-all ${isFetching ? "w-full animate-pulse" : "w-0"}`} />
        </div>
        <p className="break-all">
          <span className="text-gray-400">URL: </span>
          <span className="text-violet-300">{hasCondition ? `?${searchParams}` : "(비어 있음)"}</span>
        </p>
        <p className="mt-1 text-gray-400">
          조건 일치 <span className="font-bold text-white">{(data?.totalCount ?? 0).toLocaleString()}</span>명 중{" "}
          <span className="font-bold text-white">{characters.length}</span>명 표시
        </p>
        <p className="mt-1 text-gray-400">
          API 조건 호출: <span className="font-bold text-yellow-400">{data?.requestUrls.length ?? 0}</span>회
          <span className="text-gray-500"> (status 를 고른 개수만큼 나눠 부른다)</span>
        </p>
      </div>

      {/* 검색 */}
      <div className="relative mb-3">
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="이름 검색 (예: rick, morty, beth)"
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-20 text-sm outline-none focus:border-violet-500"
        />
        {text !== filters.q && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-violet-500">대기중…</span>
        )}
      </div>

      {/* 필터 3개 — 같은 걸 다시 누르면 해제 */}
      <div className="mb-3 space-y-2 rounded-xl border border-gray-100 bg-white p-3">
        {FILTERS.map(({ key, label, options, multi }) => {
          // 단일 필터도 배열로 맞춰서 이후 로직을 하나로 쓴다
          const selected = multi ? searchParams.getAll(key) : [searchParams.get(key) ?? ""];

          return (
            <div key={key} className="flex items-start gap-2">
              <span className="w-9 shrink-0 pt-1.5 text-xs text-gray-400">
                {label}
                {multi && <span className="ml-0.5 text-violet-500">*</span>}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {options.map((option) => {
                  const isActive = selected.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleFilter(key, option, multi)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        isActive
                          ? "border-violet-600 bg-violet-600 text-white"
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
        <p className="pt-1 text-[11px] text-gray-400">
          <span className="text-violet-500">*</span> 표시된 필터는 복수 선택 (append / getAll)
        </p>
      </div>

      {hasCondition && (
        <button
          onClick={() => setSearchParams({})}
          className="mb-3 text-xs text-violet-600 underline underline-offset-2"
        >
          조건 초기화
        </button>
      )}

      {/* 상태별 화면 */}
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
          {characters.map((character, index) => (
            <li key={character.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
              <span className="w-6 text-right font-mono text-[11px] text-gray-300">{index + 1}</span>
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
    </div>
  );
};

export default SearchParamsPage;

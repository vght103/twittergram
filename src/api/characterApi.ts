// Rick and Morty API (키 없음, 무료) — https://rickandmortyapi.com

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  gender: string;
  image: string;
  location: { name: string };
}

/** URL searchParams 에서 읽어온 검색 조건 */
export interface CharacterFilters {
  q: string;
  status: string;
  species: string;
  gender: string;
}

const BASE_URL = "https://rickandmortyapi.com/api/character";

/** 조건 -> 요청 URL. 빈 값은 아예 붙이지 않는다 (URL 규칙과 동일) */
export function buildUrl(filters: CharacterFilters, page: number) {
  const params = new URLSearchParams({ page: String(page) });
  if (filters.q) params.set("name", filters.q);
  if (filters.status) params.set("status", filters.status);
  if (filters.species) params.set("species", filters.species);
  if (filters.gender) params.set("gender", filters.gender);
  return `${BASE_URL}?${params}`;
}

export interface CharacterResult {
  characters: Character[];
  totalCount: number;
  requestUrl: string;
}

/**
 * 한 페이지에 20개씩 오므로 5페이지를 병렬로 받아 100개를 만든다.
 * 조건에 맞는 결과가 없으면 API 가 404 를 주는데, 이건 에러가 아니라 빈 결과다.
 */
export async function fetchCharacters(filters: CharacterFilters): Promise<CharacterResult> {
  const requestUrl = buildUrl(filters, 1);

  const responses = await Promise.all(
    [1, 2, 3, 4, 5].map(async (page) => {
      const res = await fetch(buildUrl(filters, page));
      if (res.status === 404) return null; // 결과 없음
      if (!res.ok) throw new Error(`불러오지 못했습니다. (HTTP ${res.status})`);
      return res.json();
    })
  );

  const ok = responses.filter((r) => r !== null);

  return {
    characters: ok.flatMap((r) => r.results as Character[]),
    totalCount: ok[0]?.info.count ?? 0,
    requestUrl,
  };
}

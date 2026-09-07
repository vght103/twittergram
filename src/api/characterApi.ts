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
  /** 하나만 고르면 문자열, 복수 선택이면 배열 */
  status: string | string[];
  species: string;
  gender: string;
}

/** API 한 번에 보낼 수 있는 조건 (status 는 하나뿐) */
interface SingleFilters {
  q: string;
  status: string;
  species: string;
  gender: string;
}

const BASE_URL = "https://rickandmortyapi.com/api/character";

/** 조건 -> 요청 URL. 빈 값은 아예 붙이지 않는다 (URL 규칙과 동일) */
export function buildUrl(filters: SingleFilters, page: number) {
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
  requestUrls: string[];
}

/**
 * 조건 하나로 100개 조회.
 * 한 페이지에 20개씩 오므로 5페이지를 병렬로 받는다.
 * 결과가 없으면 API 가 404 를 주는데, 이건 에러가 아니라 빈 결과다.
 */
async function fetchOne(filters: SingleFilters) {
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
    url: buildUrl(filters, 1),
  };
}

/**
 * 이 API 는 status 를 하나만 받는다.
 * ?status=alive&status=dead 로 보내면 앞의 것만 쓰고 뒤는 조용히 무시한다.
 * 그래서 복수 선택은 고른 개수만큼 나눠 부른 뒤 합친다.
 */
export async function fetchCharacters(filters: CharacterFilters): Promise<CharacterResult> {
  const picked = (Array.isArray(filters.status) ? filters.status : [filters.status]).filter(Boolean);
  // 하나도 안 골랐으면 status 없이 한 번만 부른다
  const statuses = picked.length > 0 ? picked : [""];

  const results = await Promise.all(statuses.map((status) => fetchOne({ ...filters, status })));

  // 조건이 달라도 같은 인물이 겹칠 수 있으니 id 로 중복 제거
  const seen = new Set<number>();
  const characters = results
    .flatMap((r) => r.characters)
    .filter((character) => {
      if (seen.has(character.id)) return false;
      seen.add(character.id);
      return true;
    });

  return {
    characters,
    totalCount: results.reduce((sum, r) => sum + r.totalCount, 0),
    requestUrls: results.map((r) => r.url),
  };
}

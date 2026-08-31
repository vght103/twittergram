export interface Stock {
  id: string;
  name: string;
  ticker: string;
  price: number;
  changeRate: number; // 등락률 (%, 양수=상승, 음수=하락)
  changePrice: number; // 등락액
  volume: number; // 거래량
  marketCap: number; // 시가총액 (억)
  sector: string;
  description: string;
}

export interface OrderRequest {
  stockId: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  message: string;
}

export const STOCKS: Stock[] = [
  { id: "1", name: "삼성전자", ticker: "005930", price: 72400, changeRate: 1.26, changePrice: 900, volume: 14523891, marketCap: 4321000, sector: "반도체", description: "글로벌 반도체·전자 기업" },
  { id: "2", name: "SK하이닉스", ticker: "000660", price: 178500, changeRate: 2.58, changePrice: 4500, volume: 5234102, marketCap: 1298000, sector: "반도체", description: "메모리 반도체 전문 기업" },
  { id: "3", name: "LG에너지솔루션", ticker: "373220", price: 368000, changeRate: -0.81, changePrice: -3000, volume: 892341, marketCap: 862000, sector: "2차전지", description: "글로벌 배터리 제조사" },
  { id: "4", name: "삼성바이오로직스", ticker: "207940", price: 891000, changeRate: 0.34, changePrice: 3000, volume: 123456, marketCap: 589000, sector: "바이오", description: "바이오의약품 CMO 기업" },
  { id: "5", name: "현대차", ticker: "005380", price: 234500, changeRate: -1.47, changePrice: -3500, volume: 1823456, marketCap: 498000, sector: "자동차", description: "글로벌 자동차 제조사" },
  { id: "6", name: "기아", ticker: "000270", price: 118200, changeRate: -0.59, changePrice: -700, volume: 2134567, marketCap: 478000, sector: "자동차", description: "글로벌 자동차 제조사" },
  { id: "7", name: "셀트리온", ticker: "068270", price: 184300, changeRate: 3.12, changePrice: 5570, volume: 3421098, marketCap: 412000, sector: "바이오", description: "바이오시밀러 전문 기업" },
  { id: "8", name: "KB금융", ticker: "105560", price: 89400, changeRate: 0.79, changePrice: 700, volume: 1567890, marketCap: 365000, sector: "금융", description: "금융 지주회사" },
  { id: "9", name: "POSCO홀딩스", ticker: "005490", price: 298000, changeRate: -2.13, changePrice: -6500, volume: 987654, marketCap: 352000, sector: "철강", description: "철강·소재 지주회사" },
  { id: "10", name: "NAVER", ticker: "035420", price: 214500, changeRate: 1.89, changePrice: 4000, volume: 2876543, marketCap: 348000, sector: "IT", description: "대한민국 대표 인터넷 플랫폼" },
  { id: "11", name: "카카오", ticker: "035720", price: 42150, changeRate: -3.21, changePrice: -1400, volume: 8765432, marketCap: 187000, sector: "IT", description: "메신저 기반 플랫폼 기업" },
  { id: "12", name: "삼성SDI", ticker: "006400", price: 312000, changeRate: 0.97, changePrice: 3000, volume: 654321, marketCap: 214000, sector: "2차전지", description: "배터리·소재 기업" },
  { id: "13", name: "하이브", ticker: "352820", price: 215500, changeRate: 4.37, changePrice: 9020, volume: 4321098, marketCap: 89000, sector: "엔터", description: "글로벌 엔터테인먼트 기업" },
  { id: "14", name: "크래프톤", ticker: "259960", price: 278000, changeRate: -0.36, changePrice: -1000, volume: 345678, marketCap: 198000, sector: "게임", description: "배틀그라운드 개발사" },
  { id: "15", name: "한화에어로스페이스", ticker: "012450", price: 452000, changeRate: 5.84, changePrice: 25000, volume: 6789012, marketCap: 276000, sector: "방산", description: "방산·항공 전문 기업" },
];

export const SECTORS = [...new Set(STOCKS.map((s) => s.sector))];

import { STOCKS, type Stock, type OrderRequest, type OrderResponse } from "./stocks";

// 네트워크 지연 시뮬레이션 (300~800ms)
const delay = () => new Promise((res) => setTimeout(res, 300 + Math.random() * 500));

// 가끔 실패하는 API 시뮬레이션 (10% 확률)
const mayFail = () => Math.random() < 0.1;

/**
 * 종목 목록 조회
 * - keyword: 종목명 or 티커로 검색
 * - sector: 섹터 필터
 * - sortBy: 정렬 기준
 */
export async function fetchStocks(params?: {
  keyword?: string;
  sector?: string;
  sortBy?: "price" | "changeRate" | "volume" | "marketCap";
  sortOrder?: "asc" | "desc";
}): Promise<Stock[]> {
  await delay();

  if (mayFail()) {
    throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }

  let result = [...STOCKS];

  // 검색
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    result = result.filter(
      (s) => s.name.toLowerCase().includes(kw) || s.ticker.includes(kw)
    );
  }

  // 섹터 필터
  if (params?.sector) {
    result = result.filter((s) => s.sector === params.sector);
  }

  // 정렬
  if (params?.sortBy) {
    const order = params.sortOrder === "asc" ? 1 : -1;
    result.sort((a, b) => (a[params.sortBy!] - b[params.sortBy!]) * order);
  }

  return result;
}

/**
 * 종목 상세 조회
 */
export async function fetchStockDetail(id: string): Promise<Stock> {
  await delay();

  const stock = STOCKS.find((s) => s.id === id);
  if (!stock) {
    throw new Error("종목을 찾을 수 없습니다.");
  }

  return stock;
}

/**
 * 주문 (매수/매도)
 * - 수량 0 이하 → 실패
 * - 가격 0 이하 → 실패
 * - 매도 시 보유 수량 체크는 클라이언트에서 처리
 */
export async function submitOrder(order: OrderRequest): Promise<OrderResponse> {
  await delay();

  if (order.quantity <= 0) {
    return { success: false, message: "수량은 1주 이상이어야 합니다." };
  }

  if (order.price <= 0) {
    return { success: false, message: "가격을 확인해주세요." };
  }

  if (mayFail()) {
    return { success: false, message: "주문 처리 중 오류가 발생했습니다. 다시 시도해주세요." };
  }

  return {
    success: true,
    orderId: `ORD-${Date.now()}`,
    message: `${order.type === "buy" ? "매수" : "매도"} 주문이 완료되었습니다.`,
  };
}

# 토스증권 프론트엔드 과제

## 주식 종목 탐색기

**제한 시간: 6시간**

---

## 개요

사용자가 주식 종목을 검색·탐색하고, 상세 정보를 확인한 뒤 매수/매도 주문을 할 수 있는 모바일 웹 화면을 구현하세요.

---

## 제공 파일

| 파일 | 설명 |
|------|------|
| `mock/stocks.ts` | 타입 정의 + 목 데이터 (15개 종목) |
| `mock/api.ts` | 비동기 API 함수 3개 |
| `TdsPage.tsx` | 시작점 |

### API 명세

```ts
// 종목 목록 조회
fetchStocks(params?: {
  keyword?: string;       // 종목명 or 티커로 검색
  sector?: string;        // 섹터 필터
  sortBy?: "price" | "changeRate" | "volume" | "marketCap";
  sortOrder?: "asc" | "desc";
}): Promise<Stock[]>

// 종목 상세 조회
fetchStockDetail(id: string): Promise<Stock>

// 주문 (매수/매도)
submitOrder(order: {
  stockId: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
}): Promise<{ success: boolean; orderId?: string; message: string }>
```

> API는 300~800ms 지연 + **10% 확률로 실패**합니다.
> **API 코드를 수정하지 마세요.**

### Stock 타입

```ts
interface Stock {
  id: string;
  name: string;          // 종목명
  ticker: string;        // 종목코드 (6자리)
  price: number;         // 현재가
  changeRate: number;    // 등락률 (%)
  changePrice: number;   // 등락액
  volume: number;        // 거래량
  marketCap: number;     // 시가총액 (억)
  sector: string;        // 섹터
  description: string;   // 설명
}
```

---

## 요구사항

### 필수 (Must)

#### 1. 종목 리스트
- `fetchStocks()`로 종목 목록을 불러와 표시
- 각 종목: **종목명, 현재가, 등락률(%), 등락액** 표시
- 상승은 **빨간색**, 하락은 **파란색**으로 구분

#### 2. 검색
- 종목명 또는 티커(숫자 코드)로 검색
- 타이핑할 때마다 API를 호출하지 않도록 **debounce 적용** (300ms 이상)

#### 3. 종목 상세
- 리스트에서 종목 클릭 시 상세 정보 표시 (BottomSheet 또는 별도 영역)
- 표시 항목: 종목명, 티커, 현재가, 등락률, 거래량, 시가총액, 섹터, 설명

#### 4. 매수/매도 주문
- 상세 화면에서 매수 또는 매도 선택
- 수량 입력 → **총 주문 금액 실시간 계산** 표시
- `submitOrder()` 호출 → 성공/실패 결과를 사용자에게 피드백

#### 5. 로딩/에러 상태
- API 호출 중 **로딩 표시**
- API 실패 시 **에러 메시지 + 재시도 버튼**

---

### 선택 (Should — 시간이 되면)

#### 6. 섹터 필터
- 섹터별 필터링 (반도체, 바이오, IT 등)

#### 7. 정렬
- 현재가, 등락률, 거래량, 시가총액 기준 정렬
- 오름차순/내림차순 토글

#### 8. 폼 유효성 검증
- 수량: 정수, 1 이상
- 빈 값 제출 방지
- 유효하지 않으면 버튼 비활성화 + 안내 메시지

---

## 기술 조건

- **TDS Mobile 컴포넌트 활용 권장** (필수 아님)
- React + TypeScript
- 상태관리 자유 (useState, zustand, TanStack Query 등)
- 스타일링 자유 (TDS, Tailwind, CSS 등)
- 작업 경로: `src/pages/tds/` 하위에서 자유롭게 구성

---

## 평가 기준

| 항목 | 비중 | 체크 포인트 |
|------|------|------------|
| **기능 완성도** | 30% | 필수 요구사항 5개가 모두 동작하는가 |
| **UX 품질** | 25% | 로딩/에러/빈 상태 처리, 피드백이 자연스러운가 |
| **코드 구조** | 25% | 관심사 분리, 커스텀 훅, 컴포넌트 설계 |
| **TypeScript** | 10% | 타입 안전성, any 없이 작성 |
| **추가 구현** | 10% | 선택 요구사항 구현 여부 |

---

완성 후 채점을 요청하세요.

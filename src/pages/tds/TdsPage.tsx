import { useQuery } from "@tanstack/react-query";
import { fetchStocks } from "./mock/api";
import { Suspense } from "react";
import { TextField } from "@toss/tds-mobile";
import { useNavigate } from "react-router";
import Spinner from "../../components/Spinner";

const TdsPage = () => {
  const { data: stocks = [], isLoading, isError } = useQuery({ queryKey: ["stocks"], queryFn: () => fetchStocks() });
  const navigate = useNavigate();
  const goToDetail = (id: string) => {
    navigate(`/tds/${id}`);
  };

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div>
      <h2>주식 종목 탐색기</h2>
      {/* 여기서부터 구현 시작 */}
      <Suspense fallback={isLoading}>
        <div>
          <TextField variant={"big"} />
        </div>
        <ul>
          {stocks.map((stock) => (
            <li key={stock.id} className="mb-2 cursor-pointer" onClick={() => goToDetail(stock.id)}>
              <div>
                <span className={`mr-2`}>{stock.name}</span>
                <span className={`mr-2`}>{stock.price}</span>
                <span className={`mr-2 ${stock.changeRate > 0 ? "text-red-600" : "text-blue-600"}`}>
                  {stock.changeRate}%
                </span>
                <span className={`mr-2`}>{stock.changePrice}</span>
              </div>
            </li>
          ))}
        </ul>
      </Suspense>
    </div>
  );
};

export default TdsPage;

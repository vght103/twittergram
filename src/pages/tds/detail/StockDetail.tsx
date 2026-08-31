import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchStockDetail } from "../mock/api";

const StockDetail = () => {
  const { id } = useParams();
  console.log("id", !!id);
  const { data: stock } = useQuery({ queryKey: ["stock"], queryFn: () => fetchStockDetail(id || ""), enabled: !!id });

  return (
    <div>
      <div></div>
      <div className="flex items-center">
        <h3 className="font-bold text-2xl !mr-2">{stock?.name}</h3>
        <span>{stock?.ticker}</span>
      </div>
      <div>
        <div>
          <span className="text-2xl font-bold">{stock?.price.toLocaleString()}원</span>

          <span>{stock?.changePrice}</span>
          <span>{stock?.changeRate}</span>
        </div>

        <div>
          <span>거래량 : </span>
          <span>{stock?.volume}</span>
        </div>
        <p>{stock?.marketCap}</p>
        <p>{stock?.sector}</p>
        <p>{stock?.description}</p>
      </div>
    </div>
  );
};

export default StockDetail;

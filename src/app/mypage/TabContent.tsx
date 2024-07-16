import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/components/formatCurrency";

interface TabContentProps {
  data: any[];
  type: "wishlist" | "sales" | "purchases" | "salebid" | "mybid";
  isExpired: (endDate: string) => boolean;
  onPaymentClick?: (event: React.MouseEvent, product: any) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  data,
  type,
  isExpired,
  onPaymentClick,
}) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {data.map((item) => (
        <div
          key={item.product_id || item.id}
          className="border p-4 rounded-lg shadow-lg flex cursor-pointer"
          onClick={() => router.push(`/product/${item.product_id || item.id}`)}
        >
          <Image
            src={item.imageUrl}
            alt={item.product_name}
            width={80}
            height={80}
            className="rounded-lg"
          />
          <div className="ml-4 flex justify-between w-full items-center">
            <div>
              <p className="font-semibold">{item.product_name}</p>
              <p>
                현재 입찰가: {formatCurrency(item.highest_price || item.price)}
              </p>
              {item.num_bid !== undefined && <p>입찰 횟수: {item.num_bid}</p>}
              {item.auction_status !== undefined && (
                <p>
                  상태:{" "}
                  {isExpired(item.end_date)
                    ? "판매 종료"
                    : item.auction_status === 1
                    ? "완료"
                    : "진행 중"}
                </p>
              )}
            </div>
            {type !== "wishlist" &&
              type !== "sales" &&
              isExpired(item.end_date) && (
                <button
                  className="bg-lime-600 text-white px-2 py-1 text-sm rounded"
                  onClick={(e) => onPaymentClick && onPaymentClick(e, item)}
                >
                  결제하기
                </button>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabContent;

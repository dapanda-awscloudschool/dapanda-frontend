"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface IResult {
  id: number;
  bidProductId: number;
  bidMemberId: number;
  bidPrice: number;
  bidDate: string;
  isSuccess: number;
}

const BidInput = ({
  productId,
  highestPrice,
  termPrice,
  bidPrice,
  setBidPrice,
}: {
  highestPrice: number;
  termPrice: number;
  bidPrice: number;
  productId: number;
  setBidPrice: (price: number) => void;
}) => {
  const [user, setUser] = useState<number | null>(null);
  const [result, setResult] = useState<IResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData.memberId);

      const subscribeToRedis = async (channel: string) => {
        try {
          const response = await fetch("/api/redis-subscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ channel }),
          });

          if (!response.ok) {
            throw new Error("Failed to subscribe to Redis channel");
          }

          const data = await response.json();
          console.log(`Subscribed to ${channel}:`, data);
        } catch (error) {
          console.error(error);
        }
      };

      // 각 채널에 대해 구독 설정
      Promise.all([
        subscribeToRedis(`/queue/reply/${parsedUserData.memberId}`),
        subscribeToRedis(`/topic/auction/${productId}`),
      ]).catch((error) => {
        console.error("Error during Redis subscription setup:", error);
      });
    } else {
      console.error("User data not found in localStorage");
    }
  }, [productId]);

  const handleInput = (e: any) => {
    const newValue = parseInt(e.target.value, 10);
    if (newValue < highestPrice + termPrice) {
      Swal.fire({
        icon: "error",
        title: "입찰 오류",
        text: "현재가보다 낮거나 같게 입력할 수 없습니다.",
      });
      setBidPrice(highestPrice + termPrice);
    } else if (newValue > 2000000000) {
      Swal.fire({
        icon: "error",
        title: "입찰 오류",
        text: "최대 2,000,000,000까지 입력가능",
      });
      setBidPrice(2000000000);
    } else {
      setBidPrice(newValue);
    }
  };

  const handleBidSubmit = useCallback(() => {
    if (!user) {
      console.error("User not set");
      return;
    }

    const bidinfo = {
      bidProductId: productId,
      bidMemberId: user,
      bidPrice: bidPrice,
    };

    console.log("Sending bid:", bidinfo);

    // 입찰 정보를 백엔드로 전송하는 로직을 추가합니다.
    // fetch 또는 axios 등을 사용해 백엔드 API로 전송하면 됩니다.
  }, [user, bidPrice, productId]);

  return (
    <>
      <div className="flex items-center mb-4">
        <label htmlFor="bidPrice" className="mr-2">
          입찰:
        </label>
        <input
          type="number"
          id="bidPrice"
          className="border rounded-md p-2"
          value={bidPrice}
          step={termPrice}
          min={highestPrice}
          max={2000000000}
          onChange={handleInput}
        />
        <div className="px-2">원</div>
        <button
          className="w-1/2 w-full text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none"
          onClick={handleBidSubmit}
        >
          입찰 확인
        </button>
      </div>
    </>
  );
};

export default BidInput;

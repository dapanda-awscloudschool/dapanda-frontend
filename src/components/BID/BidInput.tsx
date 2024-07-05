"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { BidRequest, CheckRequest } from "./action";
//import { sendBidMessage } from "./action";

interface IResult {
  id: number;
  bidProductId: number;
  bidMemberId: number;
  bidPrice: number;
  bidDate: string;
  transactionId: string;
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
  const [user, setUser] = useState(null);
  const [result, setResult] = useState<IResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData.memberId);
    }
  }, []);

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

  const handleBidSubmit = useCallback(async () => {
    const bidinfo = JSON.stringify({
      bidProductId: productId,
      bidMemberId: user,
      bidPrice: bidPrice,
    });

    const blob = new Blob([bidinfo], { type: "application/json" });
    const formData = new FormData();
    formData.append("BidReqInfo", blob);

    try {
      const data = await BidRequest(formData);
      console.log("BidRequest data:", data);
      let check;
      if (data) check = await CheckRequest(data);
      console.log("CheckRequest data:", check);
      if (check) setResult(check);
    } catch (error) {
      console.error("Error during bid submission:", error);
    }
  }, [bidPrice, productId, user]);

  useEffect(() => {
    console.log("Result changed:", result);
    if (result) {
      if (result.isSuccess === 1) {
        Swal.fire({
          icon: "success",
          title: "축하합니다.",
          text: "입찰에 성공했습니다!",
        }).then(() => {
          router.push(`/product/${productId}`);
        });
      } else if (result.isSuccess === 0) {
        Swal.fire({
          icon: "error",
          title: "입찰 실패",
          text: "입찰에 실패했습니다.",
        });
      } else {
        // isSuccess가 1이나 0이 아닌 경우 API를 다시 호출
        if (retryCount < 10) {
          setRetryCount(retryCount + 1);
          handleBidSubmit(); // API 다시 호출
        } else {
          Swal.fire({
            icon: "error",
            title: "에러",
            text: "재시도 횟수를 초과했습니다. 다시 시도해 주세요.",
          });
        }
      }
    }
  }, [result, router, productId, retryCount, handleBidSubmit]);

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

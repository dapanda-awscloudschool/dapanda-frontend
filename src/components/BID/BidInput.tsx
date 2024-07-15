"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { BidRequest, CheckRequest } from "./action";
import { UserContext } from "@/context/userContext";

interface IResult {
  id: number;
  bidProductId: number;
  bidMemberId: number;
  bidPrice: number;
  bidDate: string;
  transactionId: string;
  isSuccess: number;
  bidResult: string;
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
  const { userData } = useContext(UserContext);
  const memberId = userData[0]?.memberId;

  const [inputValue, setInputValue] = useState(bidPrice);
  const [result, setResult] = useState<IResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(parseInt(e.target.value, 10));
  };

  const handleBidSubmit = async () => {
    if (!memberId) {
      Swal.fire({
        icon: "error",
        title: "오류 발생",
        text: "회원 ID가 누락되었습니다. 로그인 후 다시 시도해주세요.",
      });
      return;
    }

    setBidPrice(inputValue);

    const bidinfo = JSON.stringify({
      bidProductId: productId,
      bidMemberId: memberId,
      bidPrice: inputValue,
    });
    const blob = new Blob([bidinfo], { type: "application/json" });
    const formData = new FormData();
    formData.append("BidReqInfo", blob);

    try {
      const data = await BidRequest(formData);
      console.log("BidRequest data:", data); // 데이터 로그 확인
      if (data !== "error") {
        await checkBidResult(data);
      } else {
        console.error("BidRequest failed, received error response");
        Swal.fire({
          icon: "error",
          title: "에러",
          text: "BidRequest에서 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      console.error("Error during bid submission:", error);
      Swal.fire({
        icon: "error",
        title: "에러",
        text: "입찰 중 오류가 발생했습니다.",
      });
    }
  };

  const checkBidResult = async (data: any) => {
    try {
      const check = await CheckRequest(data);
      console.log("CheckRequest data:", check); // 체크 데이터 로그 확인
      if (check !== "error" && check !== null) {
        setResult(check);
      } else {
        console.error("CheckRequest failed, received error response or null");
        if (retryCount < 10) {
          setRetryCount(retryCount + 1);
          setTimeout(() => checkBidResult(data), 1000); // 1초 후 재시도
        } else {
          Swal.fire({
            icon: "error",
            title: "에러",
            text: "재시도 횟수를 초과했습니다. 다시 시도해 주세요.",
          });
        }
      }
    } catch (error) {
      console.error("Error during check request:", error);
      if (retryCount < 10) {
        setRetryCount(retryCount + 1);
        setTimeout(() => checkBidResult(data), 1000); // 1초 후 재시도
      } else {
        Swal.fire({
          icon: "error",
          title: "에러",
          text: "재시도 횟수를 초과했습니다. 다시 시도해 주세요.",
        });
      }
    }
  };

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
          text: `${result.bidResult}`,
        });
      }
    }
  }, [result, router, productId]);

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
          value={inputValue}
          step={termPrice}
          min={highestPrice + termPrice}
          max={2000000000}
          onChange={handleInput}
        />
        <div className="px-2">원</div>
        <button
          className="w-full text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none"
          onClick={handleBidSubmit}
        >
          입찰 확인
        </button>
      </div>
    </>
  );
};

export default BidInput;

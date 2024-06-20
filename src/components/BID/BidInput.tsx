"use client";

// components/BID/BidInput.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BidRequest, CheckRequest } from "./action";
import { revalidatePath } from "next/cache";
import Swal from "sweetalert2";

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

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData.memberId);
      //console.log(parsedUserData);
    }
  }, []);

  const handleInput = (e: any) => {
    const newValue = parseInt(e.target.value, 10);
    if (newValue < highestPrice + termPrice) {
      alert("현재가보다 낮거나 같게 입력할 수 없습니다.");
      setBidPrice(highestPrice + termPrice);
    } else if (newValue > 2000000000) {
      alert("최대 2,000,000,000까지 입력가능");
      setBidPrice(2000000000);
    } else {
      setBidPrice(newValue);
    }
  };

  const handleBidSubmit = async () => {
    const bidinfo = JSON.stringify({
      bidProductId: productId,
      bidMemberId: user,
      bidPrice: bidPrice,
    });

    const blob = new Blob([bidinfo], { type: "application/json" });
    const formData = new FormData();
    formData.append("BidReqInfo", blob);

    const data = await BidRequest(formData);
    let check;
    if (data) check = await CheckRequest(data);
    if (check) setResult(check);
    //console.log(check);
  };

  useEffect(() => {
    if (result) {
      if (result.isSuccess === 1) {
        Swal.fire({
          icon: "success",
          title: "축하합니다.",
          text: "입찰에 성공했습니다!",
        }).then(() => {
          router.push(`/product/${productId}`);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "입찰 실패",
          text: "입찰에 실패했습니다.",
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

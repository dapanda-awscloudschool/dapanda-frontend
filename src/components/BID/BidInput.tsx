"use client";

// components/BID/BidInput.tsx
import { useState, useContext } from "react";
import { Input } from "@nextui-org/react";
import { UserContext } from "../login/UserContext";

const BidInput = ({
  highestPrice,
  termPrice,
  bidPrice,
  setBidPrice,
}: {
  highestPrice: number;
  termPrice: number;
  bidPrice: number;
  setBidPrice: (price: number) => void;
}) => {
  const userContext = useContext(UserContext);

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
      </div>
    </>
  );
};

export default BidInput;

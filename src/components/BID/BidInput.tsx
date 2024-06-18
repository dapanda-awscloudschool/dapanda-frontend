"use client";

// components/BidInput.tsx
import { useState } from "react";
import { Input } from "@nextui-org/react";

const BidInput = ({
  highestPrice,
  termPrice,
}: {
  highestPrice: number;
  termPrice: number;
}) => {
  const [value, setValue] = useState(highestPrice + termPrice);

  const handleInput = (e: any) => {
    const newValue = parseInt(e.target.value, 10);
    if (newValue < highestPrice + termPrice) {
      alert("현재가보다 낮거나 같게 입력할 수 없습니다.");
      setValue(highestPrice + termPrice);
    } else if (newValue > 2000000000) {
      alert("최대 2,000,000,000까지 입력가능");
      setValue(2000000000);
    } else {
      setValue(newValue);
    }
  };

  return (
    <input
      type="number"
      id="bidPrice"
      className="border rounded-md p-2"
      value={value}
      step={termPrice}
      min={highestPrice}
      max={2000000000}
      onChange={handleInput}
    />
  );
};

export default BidInput;

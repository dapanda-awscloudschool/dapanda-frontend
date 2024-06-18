"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface IAdd {
  id: number;
}
const Add = ({ id }: IAdd) => {
  const router = useRouter();

  const handleBidClick = () => {
    router.push(`/bid/${id}`); // 입찰 페이지로 이동
  };

  return (
    <div className="flex flex-col gap-4">
      <button className="w-full text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none">
        즉시 구매
      </button>
      <button
        className="w-full text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none"
        onClick={handleBidClick}
      >
        입찰 하기
      </button>
      <button className="w-full text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none">
        찜하기
      </button>
    </div>
  );
};

export default Add;

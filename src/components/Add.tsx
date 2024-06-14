"use client";

import { useState } from "react";
import Image from "next/image";

const Add = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Image src="/time.png" alt="" width={25} height={10} />
        <h4 className="flex justify-between flex-col font-medium">
          남은 시간: 3H
        </h4>
      </div>
      <div className=""></div>
      <button className="w-full text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none">
        즉시 구매
      </button>
      <button className="w-full text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none">
        입찰 하기
      </button>
      <button className="w-full text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none">
        찜하기
      </button>
    </div>
  );
};

export default Add;

"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { UserContext } from "@/context/userContext";

interface IAdd {
  id: number;
}

const Add = ({ id }: IAdd) => {
  const router = useRouter();
  const { isUserDataEmpty } = useContext(UserContext);

  const handleBidClick = () => {
    if (isUserDataEmpty()) {
      Swal.fire({
        icon: "error",
        title: "로그인이 필요한 기능입니다.",
        text: "로그인 페이지로 이동합니다.",
        confirmButtonText: "확인",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }
    router.push(`/bid/${id}`); // 입찰 페이지로 이동
  };

  const handleWishlistClick = () => {
    if (isUserDataEmpty()) {
      router.push("/login"); // 로그인 페이지로 이동
      return;
    }
    // 찜하기 로직 추가 필요
    console.log("찜하기 클릭");
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        className="w-full text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none"
        onClick={handleBidClick}
      >
        입찰 하기
      </button>
      <button
        className="w-full text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none"
        onClick={handleWishlistClick}
      >
        찜하기
      </button>
    </div>
  );
};

export default Add;

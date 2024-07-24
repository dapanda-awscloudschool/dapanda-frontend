"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { UserContext } from "@/context/userContext";
import {
  AddToWishlistRequest,
  RemoveFromWishlistRequest,
} from "../components/favoritelist/action";

interface IAdd {
  id: number;
  disableActions?: boolean; // 새로운 prop 추가
}

const Add = ({ id, disableActions = false }: IAdd) => {
  const router = useRouter();
  const {
    userData,
    wishlist,
    setWishlist,
    removeWishlist,
    addWishlist,
    isUserDataEmpty,
  } = useContext(UserContext);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (wishlist.includes(id)) {
      setFavorite(true);
    } else {
      setFavorite(false);
    }
  }, [id, wishlist]);

  const handleBidClick = () => {
    if (disableActions) return; // 비활성화된 경우 아무 작업도 하지 않음
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

  const handleWishlistClick = async () => {
    if (disableActions) return; // 비활성화된 경우 아무 작업도 하지 않음
    if (isUserDataEmpty()) {
      Swal.fire({
        icon: "error",
        title: "로그인이 필요합니다",
        text: "로그인 페이지로 이동합니다.",
        confirmButtonText: "확인",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    try {
      const wishlistItem = {
        member_id: userData[0].memberId,
        product_id: id,
      };
      if (favorite) {
        // Remove from wishlist
        await RemoveFromWishlistRequest(wishlistItem);
        removeWishlist(id);
      } else {
        // Add to wishlist
        await AddToWishlistRequest(wishlistItem);
        addWishlist(id);
      }
      setFavorite(!favorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Swal.fire({
        icon: "error",
        title: "오류 발생",
        text: "찜 상태를 변경하는 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        className="w-full text-sm rounded-3xl ring-1 ring-lime-600 text-lime-600 py-2 px-4 hover:bg-lime-600 hover:text-white disabled:cursor-not-allowed disabled:bg-lime-300 disabled:text-white disabled:ring-none"
        onClick={handleBidClick}
        disabled={disableActions} // 비활성화 상태 적용
      >
        입찰하기
      </button>
      <button
        className={`w-full text-sm rounded-3xl ring-1 py-2 px-4 ${
          favorite
            ? "bg-lime-600 text-white"
            : "ring-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white"
        } disabled:cursor-not-allowed disabled:bg-lime-300 disabled:text-white disabled:ring-none`}
        onClick={handleWishlistClick}
        disabled={disableActions} // 비활성화 상태 적용
      >
        {favorite ? "찜하기 완료" : "찜하기"}
      </button>
    </div>
  );
};

export default Add;

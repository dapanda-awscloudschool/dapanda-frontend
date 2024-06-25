"use client";

import { useState, useContext, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { UserContext } from "@/context/userContext";
import Swal from "sweetalert2";

interface FavoriteButtonProps {
  productId: number;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ productId }) => {
  // 버튼 눌렀는지 안눌렀는지
  const [favorite, setFavorite] = useState(false);
  // 서버에 실제로 저장되어 있는 wishlist
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("wishlist");
    if (data) {
      const wish = JSON.parse(data) as number[];
      setWishlist(wish);
      if (wish.includes(productId)) {
        setFavorite(true);
      }
    }
  }, [productId]);

  const handleFavoriteClick = async () => {
    try {
      if (favorite) {
        await removeFavorite(productId); // 예시: 서버에 찜 제거 요청
      } else {
        await addFavorite(productId); // 예시: 서버에 찜 추가 요청
      }

      const updatedWishlist = favorite
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId];

      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
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
    <button
      key={productId}
      className={`p-2 rounded-full bg-black ${
        favorite ? "text-red-500" : "text-gray-500"
      }`}
      onClick={handleFavoriteClick}
    >
      <FaHeart size={24} />
    </button>
  );
};

// 예시로 사용할 찜 추가 및 제거 함수들
const addFavorite = async (productId: number) => {
  // 서버에 찜 추가 요청하는 로직
  console.log(`Adding product ${productId} to favorites`);
};

const removeFavorite = async (productId: number) => {
  // 서버에 찜 제거 요청하는 로직
  console.log(`Removing product ${productId} from favorites`);
};

export default FavoriteButton;

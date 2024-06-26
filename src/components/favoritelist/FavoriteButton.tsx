"use client";

import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import { AddToWishlistRequest } from "./action";

interface FavoriteButtonProps {
  productId: number;
  memberId: number; // 새로운 memberId prop 추가
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  productId,
  memberId,
}) => {
  const [favorite, setFavorite] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData.memberId);
    }
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
        removeFavorite(productId);
      } else {
        // member_id가 올바르게 전달되는지 확인
        if (!user) {
          console.error("Member ID is missing");
          Swal.fire({
            icon: "error",
            title: "오류 발생",
            text: "회원 ID가 누락되었습니다.",
          });
          return;
        }
        const wishlistItem = { member_id: Number(user), product_id: productId };
        console.log("Favorite button clicked, sending request:", wishlistItem); // 요청 데이터 로그 추가
        await AddToWishlistRequest(wishlistItem);
        addFavorite(productId);
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

const addFavorite = async (productId: number) => {
  console.log(`Adding product ${productId} to favorites`);
};

const removeFavorite = async (productId: number) => {
  console.log(`Removing product ${productId} from favorites`);
};

export default FavoriteButton;

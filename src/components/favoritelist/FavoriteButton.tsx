"use client";

import { useState, useEffect, useContext } from "react";
import { FaHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import { AddToWishlistRequest, RemoveFromWishlistRequest } from "./action";
import { Button } from "@nextui-org/react";
import { UserContext } from "@/context/userContext";

interface FavoriteButtonProps {
  productId: number;
  memberId: number; // 새로운 memberId prop 추가
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ productId }) => {
  const [favorite, setFavorite] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { userData } = useContext(UserContext);

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
      if (!userData[0].memberId) {
        console.error("Member ID is missing");
        Swal.fire({
          icon: "error",
          title: "오류 발생",
          text: "회원 ID가 누락되었습니다.",
        });
        return;
      }
      const wishlistItem = {
        member_id: userData[0].memberId,
        product_id: productId,
      };
      if (favorite) {
        // Remove from wishlist
        console.log("Removing from wishlist, sending request:", wishlistItem);
        await RemoveFromWishlistRequest(wishlistItem);
        removeFavorite(productId);
      } else {
        // Add to wishlist
        console.log("Adding to wishlist, sending request:", wishlistItem);
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
    <Button
      key={productId}
      isIconOnly
      aria-label="Like"
      onClick={handleFavoriteClick}
      className={`p-2 rounded-full ${
        favorite ? "text-red-500" : "text-gray-500"
      }`}
    >
      <FaHeart size={24} />
    </Button>
  );
};

const addFavorite = async (productId: number) => {
  console.log(`Adding product ${productId} to favorites`);
};

const removeFavorite = async (productId: number) => {
  console.log(`Removing product ${productId} from favorites`);
};

export default FavoriteButton;

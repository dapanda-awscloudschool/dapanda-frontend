"use client";
import { useEffect, useState } from "react";
import { pWishList } from "./action";
import Image from "next/image";

// 사용자 ID를 가져오는 헬퍼 함수
const getUserId = () => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    const user = JSON.parse(userData);
    return user.memberId;
  }
  return null;
};

interface IWishlist {
  id: number;
  product_name: string;
  price: number;
  my_bid: number | null;
  imageUrl: string;
}

const MyPage = () => {
  const [profile, setProfile] = useState({
    name: "이름",
    username: "@username",
    email: "name@domain.com",
    address: "서울특별시 마포구 독막로112",
  });

  const [wishList, setWishList] = useState<IWishlist[]>([]);
  const [history, setHistory] = useState([
    {
      id: 1,
      product_name: "Product",
      price: 122,
      my_bid: 100,
      imageUrl:
        "https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/1/1.jpg",
    },
    {
      id: 2,
      product_name: "Product",
      price: 189,
      my_bid: 189,
      imageUrl:
        "https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/2/1.jpg",
    },
  ]);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const userId = getUserId(); // 로그인된 사용자의 ID 가져오기
        if (!userId) {
          throw new Error("User ID not found");
        }

        const data = await pWishList(parseInt(userId)); // 필요한 ID로 변경
        if (data && Array.isArray(data)) {
          setWishList(
            data.map((item) => ({
              id: item.product.product_id,
              product_name: item.product.product_name,
              price: item.product.highest_price,
              my_bid: null, // API 데이터에 따라 수정
              imageUrl: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${item.product.product_id}/1.jpg`,
            }))
          );
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    }

    fetchWishlist();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Mypage</h1>
      <div className="border p-4 rounded-lg shadow-lg mb-8">
        <div className="flex items-center mb-4">
          <Image
            src="/path/to/profile-image.jpg" // 실제 프로필 이미지 경로로 변경
            alt="Profile Image"
            width={80}
            height={80}
            className="rounded-full"
          />
          <div className="ml-4">
            <p className="text-xl font-semibold">{profile.name}</p>
            <p>{profile.username}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <p>Email: {profile.email}</p>
          <p>Delivery Address: {profile.address}</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          수정
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">찜 목록</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishList.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg shadow-lg flex">
              <Image
                src={item.imageUrl}
                alt={item.product_name}
                width={80}
                height={80}
                className="rounded-lg"
              />
              <div className="ml-4">
                <p className="font-semibold">{item.product_name}</p>
                <p>현재 입찰가: ${item.price}</p>
                {item.my_bid !== null && <p>내 입찰가: ${item.my_bid}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg shadow-lg flex">
              <Image
                src={item.imageUrl}
                alt={item.product_name}
                width={80}
                height={80}
                className="rounded-lg"
              />
              <div className="ml-4">
                <p className="font-semibold">{item.product_name}</p>
                <p>현재 입찰가: ${item.price}</p>
                <p>내 입찰가: ${item.my_bid}</p>
                <button className="bg-red-500 text-white px-2 py-1 rounded mt-2">
                  결제하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPage;

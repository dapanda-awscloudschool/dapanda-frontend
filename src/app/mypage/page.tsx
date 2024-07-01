"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, Chip } from "@nextui-org/react";
import {
  member,
  pWishList,
  saleHistory,
  buyHistory,
  salebid,
  mybid,
  updateMember,
} from "./action";
import Image from "next/image";
import { GalleryIcon } from "./GalleryIcon";
import { MusicIcon } from "./MusicIcon";
import { VideoIcon } from "./videoIcon";

const getUserId = () => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    const user = JSON.parse(userData);
    return user.memberId;
  }
  return null;
};

interface IMember {
  name: string;
  phone_num: number;
  address: string;
  email: string;
}

interface IWishlist {
  id: number;
  product_name: string;
  price: number;
  my_bid: number | null;
  imageUrl: string;
}

interface Historyproduct {
  product_id: number;
  category: string;
  product_name: string;
  start_date: string;
  end_date: string;
  last_bid_date: string;
  term_price: number;
  start_price: number;
  end_price: number;
  num_bid: number;
  auction_status: number;
  file_count: number;
  product_info: string;
  view_num: number;
  register_member_id: number;
  award_member_id: number;
  imageUrl: string;
}

const MyPage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<IMember>({
    name: "이름",
    phone_num: 0,
    email: "name@domain.com",
    address: "서울특별시 마포구 독막로112",
  });
  const [wishList, setWishList] = useState<IWishlist[]>([]);
  const [history, setHistory] = useState<Historyproduct[]>([]);
  const [bHistory, setBHistory] = useState<Historyproduct[]>([]);
  const [saleBid, setSaleBid] = useState<Historyproduct[]>([]);
  const [myBid, setMyBid] = useState<Historyproduct[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formValues, setFormValues] = useState(profile);

  useEffect(() => {
    async function fetchMemberInfo() {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error("User ID not found");
        }
        const data = await member(parseInt(userId));
        setProfile(data);
        setFormValues(data);
      } catch (error) {
        console.error("Failed to fetch member info:", error);
      }
    }

    async function fetchWishlist() {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error("User ID not found");
        }
        const data = await pWishList(parseInt(userId));
        if (data && Array.isArray(data)) {
          setWishList(
            data.map((item) => ({
              id: item.product.product_id,
              product_name: item.product.product_name,
              price: item.product.highest_price,
              my_bid: null,
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

    async function fetchHistory() {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error("User ID not found");
        }
        const data = await saleHistory(parseInt(userId));
        if (data && Array.isArray(data)) {
          setHistory(
            data.map((item) => ({
              ...item,
              imageUrl: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${item.product_id}/1.jpg`,
            }))
          );
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    }

    async function fetchBuyHistory() {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error("User ID not found");
        }
        const data = await buyHistory(parseInt(userId));
        if (data && Array.isArray(data)) {
          setBHistory(
            data.map((item) => ({
              ...item,
              imageUrl: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${item.product_id}/1.jpg`,
            }))
          );
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch buy history:", error);
      }
    }

    async function fetchSaleBid() {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error("User ID not found");
        }
        const data = await salebid(parseInt(userId));
        if (data && Array.isArray(data)) {
          setSaleBid(
            data.map((item) => ({
              ...item,
              imageUrl: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${item.product_id}/1.jpg`,
            }))
          );
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch sale bid history:", error);
      }
    }

    async function fetchMyBid() {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error("User ID not found");
        }
        const data = await mybid(parseInt(userId));
        if (data && Array.isArray(data)) {
          setMyBid(
            data.map((item) => ({
              ...item,
              imageUrl: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${item.product_id}/1.jpg`,
            }))
          );
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch my bid history:", error);
      }
    }

    fetchMemberInfo();
    fetchWishlist();
    fetchHistory();
    fetchBuyHistory();
    fetchSaleBid();
    fetchMyBid();
  }, []);

  const handleEditClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User ID not found");
      }

      const updatedProfile = await updateMember(parseInt(userId), formValues);
      setProfile(updatedProfile);
      handleClosePopup();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const isExpired = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    return now > end;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">마이페이지</h1>
      <div className="border p-4 rounded-lg shadow-lg mb-8">
        <div className="flex items-center mb-4">
          <Image
            src="/path/to/profile-image.jpg"
            alt="Profile Image"
            width={80}
            height={80}
            className="rounded-full"
          />
          <div className="ml-4">
            <p className="text-xl font-semibold">{profile.name}</p>
            <p>{profile.phone_num}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <p>Email: {profile.email}</p>
          <p>Delivery Address: {profile.address}</p>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleEditClick}
        >
          수정
        </button>
      </div>

      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
      >
        <Tab
          key="wishlist"
          title={
            <div className="flex items-center space-x-2">
              <GalleryIcon />
              <span>찜 목록</span>
              <Chip size="sm" variant="faded">
                {wishList.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {wishList.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded-lg shadow-lg flex cursor-pointer"
                onClick={() => router.push(`/product/${item.id}`)}
              >
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
        </Tab>
        <Tab
          key="sales"
          title={
            <div className="flex items-center space-x-2">
              <MusicIcon />
              <span>나의 과거 판매 목록</span>
              <Chip size="sm" variant="faded">
                {history.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {history.map((item) => (
              <div
                key={item.product_id}
                className="border p-4 rounded-lg shadow-lg flex cursor-pointer"
                onClick={() =>
                  router.push(`/product_history/${item.product_id}`)
                }
              >
                <Image
                  src={item.imageUrl}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="ml-4">
                  <p className="font-semibold">{item.product_name}</p>
                  <p>종료가: ${item.end_price}</p>
                  <p>입찰 횟수: {item.num_bid}</p>
                  <p>
                    상태:{" "}
                    {isExpired(item.end_date)
                      ? "판매 종료"
                      : item.auction_status === 1
                      ? "완료"
                      : "진행 중"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Tab>
        <Tab
          key="purchases"
          title={
            <div className="flex items-center space-x-2">
              <VideoIcon />
              <span>나의 과거 구매 목록</span>
              <Chip size="sm" variant="faded">
                {bHistory.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {bHistory.map((item) => (
              <div
                key={item.product_id}
                className="border p-4 rounded-lg shadow-lg flex cursor-pointer"
                onClick={() =>
                  router.push(`/product_history/${item.product_id}`)
                }
              >
                <Image
                  src={item.imageUrl}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="ml-4">
                  <p className="font-semibold">{item.product_name}</p>
                  <p>종료가: ${item.end_price}</p>
                  <p>입찰 횟수: {item.num_bid}</p>
                  <p>
                    상태:{" "}
                    {isExpired(item.end_date)
                      ? "판매 종료"
                      : item.auction_status === 1
                      ? "완료"
                      : "진행 중"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Tab>
        <Tab
          key="salebid"
          title={
            <div className="flex items-center space-x-2">
              <VideoIcon />
              <span>현재 진행중인 나의 경매 목록</span>
              <Chip size="sm" variant="faded">
                {saleBid.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {saleBid.map((item) => (
              <div
                key={item.product_id}
                className="border p-4 rounded-lg shadow-lg flex cursor-pointer"
                onClick={() => router.push(`/product/${item.product_id}`)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="ml-4">
                  <p className="font-semibold">{item.product_name}</p>
                  <p>종료가: ${item.end_price}</p>
                  <p>입찰 횟수: {item.num_bid}</p>
                  <p>
                    상태:{" "}
                    {isExpired(item.end_date)
                      ? "판매 종료"
                      : item.auction_status === 1
                      ? "완료"
                      : "진행 중"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Tab>
        <Tab
          key="mybid"
          title={
            <div className="flex items-center space-x-2">
              <VideoIcon />
              <span>현재 진행중인 나의 입찰 목록</span>
              <Chip size="sm" variant="faded">
                {myBid.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {myBid.map((item) => (
              <div
                key={item.product_id}
                className="border p-4 rounded-lg shadow-lg flex cursor-pointer"
                onClick={() => router.push(`/product/${item.product_id}`)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="ml-4">
                  <p className="font-semibold">{item.product_name}</p>
                  <p>종료가: ${item.end_price}</p>
                  <p>입찰 횟수: {item.num_bid}</p>
                  <p>
                    상태:{" "}
                    {isExpired(item.end_date)
                      ? "판매 종료"
                      : item.auction_status === 1
                      ? "완료"
                      : "진행 중"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Tab>
      </Tabs>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">회원정보 수정</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone_num"
                  className="block text-sm font-medium"
                >
                  전화번호
                </label>
                <input
                  type="text"
                  id="phone_num"
                  name="phone_num"
                  value={formValues.phone_num}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium">
                  주소
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;

"use client";
import Image from "next/image";
import React, { useState } from "react";

const MyPage = () => {
  const [profile, setProfile] = useState({
    name: "이름",
    username: "@username",
    email: "name@domain.com",
    address: "서울특별시 마포구 독막로112",
  });

  const [wishList, setWishList] = useState([
    {
      id: 1,
      product_name: "Product",
      price: 122,
      my_bid: 100,
      imageUrl: "/path/to/image1.jpg",
    },
    {
      id: 2,
      product_name: "Product",
      price: 155,
      my_bid: null,
      imageUrl: "/path/to/image2.jpg",
    },
  ]);

  const [history, setHistory] = useState([
    {
      id: 1,
      product_name: "Product",
      price: 122,
      my_bid: 100,
      imageUrl: "/path/to/image1.jpg",
    },
    {
      id: 2,
      product_name: "Product",
      price: 189,
      my_bid: 189,
      imageUrl: "/path/to/image2.jpg",
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Mypage</h1>
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
                {item.my_bid && <p>내 입찰가: ${item.my_bid}</p>}
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

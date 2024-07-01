"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { createProduct } from "./action";
import Swal from "sweetalert2";

const CartModal = () => {
  const cartItems = true;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    category: "",
    product_name: "",
    term_price: 0,
    start_price: 0,
    product_info: "",
    register_member: 1, // 현재 로그인된 사용자의 ID로 대체
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 10); // 최대 10개의 파일 선택
      setImageFiles(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("category", formValues.category);
      formData.append("product_name", formValues.product_name);
      formData.append("term_price", String(formValues.term_price));
      formData.append("start_price", String(formValues.start_price));
      formData.append("product_info", formValues.product_info);
      formData.append("register_member", String(formValues.register_member));
      imageFiles.forEach((file, index) => {
        formData.append(`images[${index}]`, file); // 이미지 배열로 추가
      });

      const result = await createProduct(formData); // Use the createProduct function from action.tsx
      console.log("Product registered:", result);

      // 등록 성공 메시지 표시
      Swal.fire({
        icon: "success",
        title: "Product registered successfully",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      handleClosePopup();
    } catch (error) {
      console.error("Failed to register product:", error);
    }
  };

  return (
    <div className="relative">
      <div className="w-max absolute p-4 rounded-md shadow-[0_3px_5px_rgb(0,0,0,2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
        {!cartItems ? (
          <div className="">찜 목록이 비어있습니다</div>
        ) : (
          <>
            <h2 className="text-x font-semibold">찜 목록</h2>
            <div className="flex flex-col gap-8">
              <div className="flex gap-4">
                <Image
                  src="https://images.pexels.com/photos/18114984/pexels-photo-18114984.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                  alt=""
                  width={72}
                  height={96}
                  className="object-cover rounded-md"
                />
                <div className="flex flex-col justify-between w-full">
                  <div className="">
                    <div className="flex items-center justify-between gap-8">
                      <h3 className="font-semibold">Product Name</h3>
                      <div className="p-1 bg-gray-50 rounded-sm">$50</div>
                    </div>
                    <div className="text-sm text-gray-500">available</div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Qty. 2</span>
                    <span className="text-blue-500">Remove</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Image
                  src="https://images.pexels.com/photos/18114984/pexels-photo-18114984.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                  alt=""
                  width={72}
                  height={96}
                  className="object-cover rounded-md"
                />
                <div className="flex flex-col justify-between w-full">
                  <div className="">
                    <div className="flex items-center justify-between gap-8">
                      <h3 className="font-semibold">Product Name</h3>
                      <div className="p-1 bg-gray-50 rounded-sm">$50</div>
                    </div>
                    <div className="text-sm text-gray-500">available</div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Qty. 2</span>
                    <span className="text-blue-500">Remove</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex items-center justify-between font-semibold">
                <span className="">Subtotal</span>
                <span className="">$50</span>
              </div>
              <p className="text-gray-500 text-sm mt-2 mb-4">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="flex justify-between text-sm">
                <Link href="/mypage">
                  <div className="rounded-md py-3 px-4 ring-1 ring-gray-300">
                    마이페이지
                  </div>
                </Link>
                <button
                  className="rounded-md py-3 px-4 bg-black text-white"
                  onClick={handleOpenPopup}
                >
                  물품 등록하기
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">물품 등록</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium">
                  카테고리
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formValues.category}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="product_name"
                  className="block text-sm font-medium"
                >
                  제품명
                </label>
                <input
                  type="text"
                  id="product_name"
                  name="product_name"
                  value={formValues.product_name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="term_price"
                  className="block text-sm font-medium"
                >
                  최소 입찰 단위
                </label>
                <input
                  type="number"
                  id="term_price"
                  name="term_price"
                  value={formValues.term_price}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="start_price"
                  className="block text-sm font-medium"
                >
                  시작 가격
                </label>
                <input
                  type="number"
                  id="start_price"
                  name="start_price"
                  value={formValues.start_price}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="images" className="block text-sm font-medium">
                  이미지 (최대 10개)
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept=".png, .jpg, .jpeg"
                  multiple
                  onChange={handleImageChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="product_info"
                  className="block text-sm font-medium"
                >
                  제품 정보
                </label>
                <textarea
                  id="product_info"
                  name="product_info"
                  value={formValues.product_info}
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
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartModal;

"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import { createProduct } from "./action";
import Swal from "sweetalert2";
import { UserContext } from "@/context/userContext";

const CartModal = () => {
  const cartItems = true;
  const { userData } = useContext(UserContext); // UserContext 사용
  const memberId = userData[0]?.memberId;

  const [formValues, setFormValues] = useState({
    category: "",
    product_name: "",
    start_date: "",
    end_date: "",
    term_price: 0,
    start_price: 0,
    highest_price: 0,
    product_info: "",
    register_member: memberId || 0, // UserContext에서 가져온 memberId 사용
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 userId를 가져와서 formValues에 설정
    setFormValues((prevValues) => ({
      ...prevValues,
      register_member: memberId || 0,
    }));
  }, [memberId]);

  const handleOpenPopup = () => {
    Swal.fire({
      title: "물품 등록",
      width: 600,
      padding: "3em",
      background: "#fff url(/images/trees.png)",
      backdrop: `
        rgba(0,0,0,0.4)
        url("/images/gift.gif")
        left bottom
        no-repeat
      `,
      html: `
        <form id="productForm">
          <div class="mb-4">
            <label for="category" class="block text-sm font-medium">카테고리</label>
            <input type="text" id="category" name="category" class="mt-1 p-2 w-full border rounded" />
          </div>
          <div class="mb-4">
            <label for="product_name" class="block text-sm font-medium">제품명</label>
            <input type="text" id="product_name" name="product_name" class="mt-1 p-2 w-full border rounded" />
          </div>
          <div class="mb-4">
            <label for="start_date" class="block text-sm font-medium">시작 날짜</label>
            <input type="datetime-local" id="start_date" name="start_date" class="mt-1 p-2 w-full border rounded" />
          </div>
          <div class="mb-4">
            <label for="end_date" class="block text-sm font-medium">종료 날짜</label>
            <input type="datetime-local" id="end_date" name="end_date" class="mt-1 p-2 w-full border rounded" />
          </div>
          <div class="mb-4">
            <label for="term_price" class="block text-sm font-medium">최소 입찰 단위</label>
            <input type="number" id="term_price" name="term_price" class="mt-1 p-2 w-full border rounded" />
          </div>
          <div class="mb-4">
            <label for="start_price" class="block text-sm font-medium">시작 가격</label>
            <input type="number" id="start_price" name="start_price" class="mt-1 p-2 w-full border rounded" />
          </div>
          <div class="mb-4">
            <label for="highest_price" class="block text-sm font-medium">최고 가격</label>
            <input type="number" id="highest_price" name="highest_price" class="mt-1 p-2 w-full border rounded" />
          </div>
          <div class="mb-4">
            <label for="images" class="block text-sm font-medium">이미지 (최대 10개)</label>
            <input type="file" id="images" name="images" accept=".png, .jpg, .jpeg" multiple class="mt-1 p-2 w-full border rounded" />
          </div>
          <div class="mb-4">
            <label for="product_info" class="block text-sm font-medium">제품 정보</label>
            <textarea id="product_info" name="product_info" class="mt-1 p-2 w-full border rounded"></textarea>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: "등록하기",
      preConfirm: () => {
        const form = document.getElementById("productForm") as HTMLFormElement;
        const formData = new FormData(form);
        const formObject: any = {};
        formData.forEach((value, key) => {
          if (key === "images") {
            if (!formObject[key]) {
              formObject[key] = [];
            }
            formObject[key].push(value);
          } else {
            formObject[key] = value;
          }
        });
        return formObject;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("category", result.value.category);
          formData.append("product_name", result.value.product_name);
          formData.append("start_date", result.value.start_date);
          formData.append("end_date", result.value.end_date);
          formData.append("term_price", result.value.term_price);
          formData.append("start_price", result.value.start_price);
          formData.append("highest_price", result.value.highest_price);
          formData.append("product_info", result.value.product_info);
          formData.append(
            "register_member",
            formValues.register_member.toString()
          ); // 숫자를 문자열로 변환
          result.value.images.forEach((file: File, index: number) => {
            formData.append(`images[${index}]`, file); // 이미지 배열로 추가
          });

          const productResult = await createProduct(formData);
          console.log("Product registered:", productResult);

          Swal.fire({
            icon: "success",
            title: "상품이 경매에 등록되었습니다!",
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
        } catch (error) {
          console.error("Failed to register product:", error);
        }
      }
    });
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
    </div>
  );
};

export default CartModal;

"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import CartModal from "./Cart/CartModal";
import Swal from "sweetalert2";
import { createProduct } from "@/components/Cart/action"; // createProduct 임포트

// Local storage에서 userId를 가져오는 함수
const getUserId = () => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    const user = JSON.parse(userData);
    return user.memberId;
  }
  return null;
};

const NavIcons = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggined, setIsLoggined] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const [formValues, setFormValues] = useState({
    category: "",
    product_name: "",
    term_price: 0,
    start_price: 0,
    product_info: "",
    register_member: getUserId(), // 현재 로그인된 사용자의 ID로 대체
  });

  const handleLogout = async () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("wishlist");
    setIsLoggined(false); // 로그아웃 시 로그인 상태를 false로 변경
    window.location.reload(); // 페이지 새로고침
  };

  const checkLoginStatus = () => {
    if (localStorage.getItem("userData")) {
      setIsLoggined(true);
    } else {
      setIsLoggined(false);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // 컴포넌트 마운트 시 로그인 상태 확인
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen]);

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
            <label for="term_price" class="block text-sm font-medium">최소 입찰 단위</label>
            <input type="number" id="term_price" name="term_price" class="mt-1 p-2 w-full border rounded" />
          </div>
          <div class="mb-4">
            <label for="start_price" class="block text-sm font-medium">시작 가격</label>
            <input type="number" id="start_price" name="start_price" class="mt-1 p-2 w-full border rounded" />
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
        return formData;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formData = result.value;
          formData.append(
            "register_member",
            String(formValues.register_member)
          );

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

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="cursor-pointer">
        {isLoggined ? (
          <div onClick={handleLogout}>로그아웃</div>
        ) : (
          <div onClick={handleLogin}>로그인</div>
        )}
      </div>
      <Link href="/mypage">
        <div className="cursor-pointer">마이페이지</div>
      </Link>
      <button className="cursor-pointer" onClick={handleOpenPopup}>
        물품 등록하기
      </button>
      {/* <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <img src="/cart.png" alt="장바구니" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-dapanda rounded-full text-white text-sm flex items-center justify-center">
          0
        </div>
      </div>
      {isCartOpen && (
        <div ref={cartRef}>
          <CartModal />
        </div>
      )} */}
    </div>
  );
};

export default NavIcons;

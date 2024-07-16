"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, useContext } from "react";
import CartModal from "./Cart/CartModal";
import Swal from "sweetalert2";
import { createProduct } from "@/components/Cart/action"; // createProduct 임포트
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { FaRegQuestionCircle } from "react-icons/fa"; // 아이콘 임포트
import { Modal, Box, Typography, Button } from "@mui/material"; // Material-UI 컴포넌트 임포트

const NavIcons = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggined, setIsLoggined] = useState(false);
  const { isUserDataEmpty, userData } = useContext(UserContext);
  const cartRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); // 도움말 모달 상태

  const memberId = userData[0]?.memberId || 0;

  const [formValues, setFormValues] = useState({
    category: "",
    product_name: "",
    term_price: 0,
    start_price: 0,
    product_info: "",
    register_member: memberId, // UserContext에서 가져온 memberId로 대체
  });

  const handleLogout = async () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("wishlist");
    setIsLoggined(false); // 로그아웃 시 로그인 상태를 false로 변경
    window.location.reload(); // 페이지 새로고침
  };

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
    if (isUserDataEmpty()) {
      router.push("/login");
      return;
    }

    Swal.fire({
      title: "물품 등록",
      width: 600,
      padding: "3em",
      background: "#fff",
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
            formValues.register_member.toString() // String으로 변환하여 추가
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

  const handleHelpModalOpen = () => {
    setIsHelpModalOpen(true);
  };

  const handleHelpModalClose = () => {
    setIsHelpModalOpen(false);
  };

  return (
    <div className="flex items-center gap-5 text-sm">
      <div className="cursor-pointer">
        {isUserDataEmpty() ? (
          <div onClick={handleLogin}>로그인</div>
        ) : (
          <div onClick={handleLogout}>로그아웃</div>
        )}
      </div>
      <div
        className="cursor-pointer"
        onClick={() => {
          if (isUserDataEmpty()) {
            router.push("/login");
            return;
          }
          router.push("/mypage");
        }}
      >
        마이페이지
      </div>
      <button className="cursor-pointer" onClick={handleOpenPopup}>
        물품 등록하기
      </button>
      <FaRegQuestionCircle
        className="text-xl cursor-pointer"
        onClick={handleHelpModalOpen}
      />{" "}
      {/* 도움말 모달 열기 */}
      <Modal
        open={isHelpModalOpen}
        onClose={handleHelpModalClose}
        aria-labelledby="help-modal-title"
        aria-describedby="help-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="help-modal-title" variant="h6" component="h2">
            서비스 사용 설명
          </Typography>
          <Typography id="help-modal-description" sx={{ mt: 2 }}>
            여기에 서비스 사용에 대한 자세한 설명을 입력하세요.
          </Typography>
          <Button onClick={handleHelpModalClose} sx={{ mt: 2 }}>
            닫기
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default NavIcons;

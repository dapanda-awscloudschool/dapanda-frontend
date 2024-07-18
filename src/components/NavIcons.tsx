"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaRegQuestionCircle } from "react-icons/fa";
import { Modal, Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { UserContext } from "@/context/userContext";
import Swal from "sweetalert2";
import { createProduct } from "@/components/Cart/action";
import styles from "./NavIcons.module.css";

const NavIcons = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggined, setIsLoggined] = useState(false);
  const { isUserDataEmpty, userData } = useContext(UserContext);
  const cartRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const memberId = userData[0]?.memberId || 0;

  const [formValues, setFormValues] = useState({
    category: "",
    product_name: "",
    term_price: 0,
    start_price: 0,
    product_info: "",
    register_member: memberId,
  });

  useEffect(() => {
    AOS.init({ duration: 1200 });

    // Check if the user is new and open the help modal if true
    if (pathname === "/") {
      const isNewUser = localStorage.getItem("isNewUser");
      if (isNewUser === "true") {
        setIsHelpModalOpen(true);
        localStorage.removeItem("isNewUser");
      }
    }
  }, [pathname]);

  const handleLogout = async () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("wishlist");
    setIsLoggined(false);
    window.location.reload();
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
            formValues.register_member.toString()
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

  const nextSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const slides = [
    {
      title: "DAPANDA 이용 방법",
      subtitle: "물품 등록하는 법",
      images: [
        "/useOurService/1.png",
        "/useOurService/2.png",
        "/useOurService/3.png",
        "/useOurService/4.png",
        "/useOurService/5.png",
        "/useOurService/6.png",
      ],
    },
    {
      title: "DAPANDA 이용 방법",
      subtitle: "입찰하는 법",
      images: [
        "/Bid/1.png",
        "/Bid/2.png",
        "/Bid/3.png",
        "/Bid/4.png",
        "/Bid/5.png",
        "/Bid/6.png",
        "/Bid/7.png",
        "/Bid/8.png",
        "/Bid/9.png",
      ],
    },
  ];

  return (
    <div className="flex items-center gap-5 text-sm justify-center">
      <div className="cursor-pointer">
        {isUserDataEmpty() ? (
          <div onClick={handleLogin} style={{ margin: "0 10px" }}>
            로그인
          </div>
        ) : (
          <div onClick={handleLogout} style={{ margin: "0 10px" }}>
            로그아웃
          </div>
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
        style={{ margin: "0 10px" }}
      >
        마이페이지
      </div>
      <button
        className="cursor-pointer"
        onClick={handleOpenPopup}
        style={{ margin: "0 10px" }}
      >
        물품 등록하기
      </button>
      <FaRegQuestionCircle
        className="text-xl cursor-pointer"
        onClick={handleHelpModalOpen}
        style={{ margin: "0 10px" }}
      />
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
            width: "80%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowX: "hidden",
            overflowY: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            id="help-modal-title"
            variant="h3"
            component="h2"
            sx={{
              fontWeight: "bold",
              mb: 2,
              fontFamily: "Arial, sans-serif",
              color: "#000000",
            }}
            data-aos="fade-up"
          >
            {slides[slideIndex].title}
          </Typography>
          <Typography
            id="help-modal-description"
            variant="h5"
            sx={{
              mt: 2,
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
              color: "#000000",
              marginBottom: "20px", // Add marginBottom here
            }}
            data-aos="fade-up"
          >
            {slides[slideIndex].subtitle}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
            data-aos="fade-up"
          >
            {slides[slideIndex].images.map((src, index) => (
              <div
                key={index}
                style={{
                  width: "100%",
                  maxWidth: "1000px",
                  position: "relative",
                  aspectRatio: "16/9",
                  marginBottom: "20px", // 각 이미지 사이의 간격 추가
                  border: "2px solid #4CAF50", // 이미지 테두리 추가
                  marginTop: index === 0 ? "20px" : "0", // Add marginTop to the first image
                }}
              >
                <Image
                  src={src}
                  alt={`사용 설명 ${index + 1}`}
                  fill
                  sizes="(max-width: 1000px) 100vw, 1000px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
          <div className={styles.navigationButtons}>
            <div className={styles.leftButton}>
              {slideIndex > 0 && (
                <Button
                  onClick={prevSlide}
                  className={styles.navButton}
                  sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
                >
                  이전
                </Button>
              )}
            </div>
            <div className={styles.rightButton}>
              {slideIndex < slides.length - 1 && (
                <Button
                  onClick={nextSlide}
                  className={styles.navButton}
                  sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
                >
                  다음
                </Button>
              )}
            </div>
          </div>
          <Button
            onClick={handleHelpModalClose}
            sx={{ backgroundColor: "#4CAF50", color: "#fff", mt: 2 }}
          >
            닫기
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default NavIcons;

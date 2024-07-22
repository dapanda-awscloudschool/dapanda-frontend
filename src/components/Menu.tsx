"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegQuestionCircle } from "react-icons/fa";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Modal, Box, Typography, Button } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import { createProduct } from "@/components/Cart/action";
import styles from "./NavIcons.module.css";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const { isUserDataEmpty, userData } = useContext(UserContext);
  const router = useRouter();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const memberId = userData[0]?.memberId;

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

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
        formData.append("register_member", memberId.toString());
        return formData;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formData = result.value;

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

  const handleHelpModalOpen = () => {
    setIsHelpModalOpen(true);
  };

  const handleHelpModalClose = () => {
    setIsHelpModalOpen(false);
  };

  const nextSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    const modalContent = document.querySelector(".MuiBox-root");
    if (modalContent) {
      modalContent.scrollTop = 0; // Scroll to top
    }
  };

  const prevSlide = () => {
    setSlideIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
    const modalContent = document.querySelector(".MuiBox-root");
    if (modalContent) {
      modalContent.scrollTop = 0; // Scroll to top
    }
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

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("wishlist");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleMenuClick = () => {
    setOpen(false);
  };

  return (
    <div ref={menuRef}>
      <Image
        src="/menu.png"
        alt=""
        width={28}
        height={28}
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute bg-black text-white left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-xl z-10">
          <Link href="/" onClick={handleMenuClick}>
            홈
          </Link>
          <Link href="/list" onClick={handleMenuClick}>
            전제품
          </Link>
          {isUserDataEmpty() ? (
            <div
              onClick={() => {
                handleLogin();
                handleMenuClick();
              }}
              className="cursor-pointer"
            >
              로그인
            </div>
          ) : (
            <div
              onClick={() => {
                handleLogout();
                handleMenuClick();
              }}
              className="cursor-pointer"
            >
              로그아웃
            </div>
          )}
          <Link href="/mypage" onClick={handleMenuClick}>
            마이페이지
          </Link>
          <div
            onClick={() => {
              handleOpenPopup();
              handleMenuClick();
            }}
            className="cursor-pointer"
          >
            물품 등록하기
          </div>
          <FaRegQuestionCircle
            className="text-2xl cursor-pointer"
            onClick={() => {
              handleHelpModalOpen();
              handleMenuClick();
            }}
          />
        </div>
      )}
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
              marginBottom: "20px",
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
                  marginBottom: "20px",
                  border: "2px solid #4CAF50",
                  marginTop: index === 0 ? "20px" : "0",
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
                  sx={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#C7FC20",
                    },
                  }}
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
                  sx={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#C7FC20",
                    },
                  }}
                >
                  다음
                </Button>
              )}
            </div>
          </div>
          <Button
            onClick={handleHelpModalClose}
            sx={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              mt: 2,
              "&:hover": {
                backgroundColor: "#C7FC20",
              },
            }}
          >
            닫기
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Menu;

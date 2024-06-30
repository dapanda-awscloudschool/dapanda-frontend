"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import CartModal from "./Cart/CartModal";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggined, setIsLoggined] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const handleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    checkLoginStatus(); // 프로필 열 때 로그인 상태 확인
  };

  const handleLogout = async () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("wishlist");
    setIsLoggined(false); // 로그아웃 시 로그인 상태를 false로 변경
    setIsProfileOpen(false);
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
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    if (isProfileOpen || isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, isCartOpen]);

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
      />
      {isProfileOpen && (
        <div
          ref={profileRef}
          className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20"
        >
          {isLoggined ? (
            <div className="mt-2 cursor-pointer" onClick={handleLogout}>
              <Link href="/" onClick={() => setIsProfileOpen(false)}>
                Logout
              </Link>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsProfileOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
      <Image
        src="/notification.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-dapanda rounded-full text-white text-sm flex items-center justify-center">
          0
        </div>
      </div>
      {isCartOpen && (
        <div ref={cartRef}>
          <CartModal />
        </div>
      )}
    </div>
  );
};

export default NavIcons;

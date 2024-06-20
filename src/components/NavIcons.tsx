"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useContext } from "react";
import CartModal from "./CartModal";
import { UserContext } from "@/context/userContext";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isUserDataEmpty, clearUserData } = useContext(UserContext);
  const router = useRouter();
  const pathName = usePathname();

  const handleProfile = () => {
    if (!isUserDataEmpty) {
      setIsProfileOpen(false); // 프로필 메뉴를 닫습니다
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await clearUserData(); // 사용자 데이터를 지우기 전에 await를 사용하여 비동기 처리를 기다립니다
    setIsLoading(false);
    setIsProfileOpen(false);
  };

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
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          <Link href="/login" onClick={() => setIsProfileOpen(false)}>
            Login
          </Link>
          <div className="mt-2 cursor-pointer" onClick={handleLogout}>
            {isLoading ? "Logging out" : "Logout"}
          </div>
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
      {isCartOpen && <CartModal />}
    </div>
  );
};

export default NavIcons;

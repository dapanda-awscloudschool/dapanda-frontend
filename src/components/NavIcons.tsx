"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import CartModal from "./CartModal";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggined, setIsLoggined] = useState(false);

  const handleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    localStorage.removeItem("userData");
    setIsProfileOpen(false);
  };

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      setIsLoggined(true);
    }
  }, []);

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
      {isCartOpen && <CartModal />}
    </div>
  );
};

export default NavIcons;

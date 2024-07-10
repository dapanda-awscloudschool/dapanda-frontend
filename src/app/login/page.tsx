"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";
import { LoginAPI, getWishlist } from "./action";
import Swal from "sweetalert2"; // SweetAlert2 import

const LoginPage = () => {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    if (userData) {
      const handleLogin = async () => {
        try {
          const data = await LoginAPI(userData.memberId);
          setUserData(data);
          localStorage.setItem("userData", JSON.stringify(data));
          const wishlist = await getWishlist(data.memberId);
          localStorage.setItem("wishlist", JSON.stringify(wishlist));
          Swal.fire({
            icon: "success",
            title: "로그인 성공",
            text: "로그인에 성공했습니다!",
          }).then(() => {
            router.push("/"); // 메인 페이지로 이동
          });
        } catch (error) {
          console.error("Error during login:", error);
          Swal.fire({
            icon: "error",
            title: "로그인 실패",
            text: "로그인에 실패했습니다. 다시 시도해주세요.",
          });
        }
      };

      handleLogin();
    }
  }, [userData, setUserData, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-lime-50">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="bg-lime-100 flex-grow flex items-center justify-center">
            <img
              className="w-full h-full object-cover"
              src="/images/limepanda.gif"
              alt="Eat Bamboo"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
          <div className="p-8 w-full md:w-1/2 flex items-center justify-center flex-col">
            <div className="uppercase tracking-wide text-3xl text-indigo-500 font-semibold text-2xl">
              DAPANDA
            </div>
            <h1 className="block mt-1 text-lg leading-tight font-semibold text-black text-center text-xl">
              지금 바로 경매에 참여하세요!
            </h1>
            <form
              action="/api/auth/google-sign-in"
              method="GET"
              className="mt-6 w-full"
            >
              <button
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                type="submit"
              >
                Sign in with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

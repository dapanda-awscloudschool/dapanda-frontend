"use client";

import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { UserContext } from "@/context/userContext";
import { LoginAPI } from "../login/action"; // checkUser 및 getWishlist 가져오기
import { checkUser, getWishlist } from "../auth/action";
import Swal from "sweetalert2"; // SweetAlert2 import

const RegisterPage = () => {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const data = await LoginAPI(
        userData[0].memberString,
        userData[0].email,
        name,
        phoneNum,
        address
      );
      const updatedUserData = await checkUser(userData[0].memberString);
      if (updatedUserData !== "null") {
        const parsedUserData = JSON.parse(updatedUserData);
        setUserData([parsedUserData]);
        localStorage.setItem("userData", JSON.stringify(parsedUserData));
        localStorage.setItem("isNewUser", "true"); // New user flag 설정

        const wishListString = await getWishlist(parsedUserData.memberId);
        localStorage.setItem("wishlist", JSON.stringify(wishListString));
      }

      Swal.fire({
        icon: "success",
        title: "등록 성공",
        text: "회원 정보가 성공적으로 등록되었습니다!",
      }).then(() => {
        router.push("/");
      });
    } catch (error) {
      console.error("Error during registration:", error);
      Swal.fire({
        icon: "error",
        title: "등록 실패",
        text: "회원 정보 등록에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">회원 등록</h1>
        <input
          type="text"
          placeholder="User ID"
          value={userData[0].memberString}
          disabled
          className="mb-4 p-2 w-full border border-gray-300 rounded bg-gray-200"
        />
        <input
          type="email"
          placeholder="Email"
          value={userData[0].email}
          disabled
          className="mb-4 p-2 w-full border border-gray-300 rounded bg-gray-200"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNum}
          onChange={(e) => setPhoneNum(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <button
          className="bg-dapanda text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed w-full mt-6"
          disabled={isLoading}
          onClick={handleRegister}
        >
          {isLoading ? "Loading..." : "Register"}
        </button>
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default RegisterPage;

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/context/userContext";
import { LoginAPI } from "../login/action";
import Swal from "sweetalert2"; // SweetAlert2 import

const RegisterPage = () => {
  const router = useRouter();
  const { setUserData } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [address, setAddress] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUserId(parsedUserData.memberId);
      setEmail(parsedUserData.email);
    } else {
      router.push("/"); // 사용자가 로그인되지 않았으면 홈 페이지로 리디렉션
    }
  }, [router]);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      // LoginAPI 호출 시 모든 인자를 제공
      const data = await LoginAPI(userId, email, name, phoneNum, address);
      if (data.length > 1) {
        setUserData(data);
      }

      localStorage.setItem(
        "userData",
        JSON.stringify({
          memberId: userId,
          email: email,
          name: name,
          phoneNum: phoneNum,
          address: address,
        })
      );
      Swal.fire({
        icon: "success",
        title: "등록 성공",
        text: "회원 정보가 성공적으로 등록되었습니다!",
      }).then(() => {
        router.push("/"); // 메인 페이지로 이동
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
          value={userId}
          disabled
          className="mb-4 p-2 w-full border border-gray-300 rounded bg-gray-200"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
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

"use client";

import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { UserContext } from "@/context/userContext";
import { LoginAPI } from "./action";
import Swal from "sweetalert2"; // SweetAlert2 import

const API_URL_SPRING = process.env.API_URL_SPRING || "";

const LoginPage = () => {
  const router = useRouter();
  const { setUserData } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = await LoginAPI(username);
    setIsLoading(false);
    setUserData(data);
    if (data.name === "로그인 실패") {
      Swal.fire({
        icon: "warning",
        title: "로그인 실패",
        text: "본인ID가 맞는지 확인해주세요!",
      });
    } else {
      localStorage.setItem("userData", JSON.stringify(data));
      Swal.fire({
        icon: "success",
        title: "로그인 성공",
        text: "로그인에 성공했습니다!",
      }).then(() => {
        router.push("/");
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Log In</h1>
        <div className="flex flex-col gap-4">
          <label className="text-sm text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            placeholder="john"
            className="ring-2 ring-gray-300 rounded-md p-4 w-full"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button
          className="bg-dapanda text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed w-full mt-6"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
        {error && <div className="text-red-600 mt-4">{error}</div>}
        {message && (
          <div className="text-green-600 text-sm mt-4">{message}</div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

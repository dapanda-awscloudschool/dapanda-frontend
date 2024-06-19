"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { UserContext } from "@/components/login/UserContext";

const API_URL_SPRING = process.env.NEXT_PUBLIC_API_URL_SPRING || "";

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    const userinfo = JSON.stringify({
      name: username,
    });

    const blob = new Blob([userinfo], { type: "application/json" });
    const formData = new FormData();
    formData.append("MemberLoginReqDto", blob);

    try {
      const response = await fetch(`${API_URL_SPRING}/api/spring/member`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Response Status:", response.status, response.statusText);
      console.log("Response Data:", data);

      if (response.ok) {
        if (data.memberId === 0) {
          setError("Login failed!");
        } else {
          setUser({ memberId: data.memberId, name: data.name });
          setMessage("Login successful!");
          router.push("/"); // 메인 페이지로 리디렉션
        }
      } else {
        setError("Login failed!");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
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

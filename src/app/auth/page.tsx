"use client";

import { UserContext } from "@/context/userContext";
import { useContext, useEffect } from "react";
import { checkUser, getWishlist } from "./action";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const { updateUserData, setUserData } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve tempData from localStorage
      const storedTempData = localStorage.getItem("tempData");
      let user_info;
      if (storedTempData) {
        user_info = JSON.parse(storedTempData);

        localStorage.removeItem("tempData");
        const data = await checkUser(user_info.memberString);
        console.log(data);
        if (data == "null") {
          updateUserData({
            email: user_info.email,
            memberString: user_info.memberString,
          });
          router.push("/RegisterPage");
        } else {
          const user_data = JSON.parse(data);
          console.log(user_data);
          setUserData([user_data]);
          const wishListString = await getWishlist(user_data.memberId);
          localStorage.setItem("wishlist", JSON.stringify(wishListString));
          //console.log("wishlist", wishListString);
          //   if (wishListString) {
          //     const wishListArray = wishListString
          //       .split(",")
          //       .map((item: string) => parseInt(item.trim(), 10));
          //     localStorage.setItem("wishlist", JSON.stringify(wishListArray));
          //   } else {
          //     localStorage.setItem("wishlist", JSON.stringify([]));
          //   }

          router.push("/");
        }
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs once after the initial render

  return <div></div>;
};

export default AuthPage;

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
      const storedTempData = localStorage.getItem("tempData");
      let user_info;
      if (storedTempData) {
        user_info = JSON.parse(storedTempData);

        localStorage.removeItem("tempData");
        const data = await checkUser(user_info.memberString);
        if (data == "null") {
          updateUserData({
            email: user_info.email,
            memberString: user_info.memberString,
          });
          router.push("/RegisterPage");
        } else {
          const user_data = JSON.parse(data);
          setUserData([user_data]);
          const wishListString = await getWishlist(user_data.memberId);
          localStorage.setItem("wishlist", JSON.stringify(wishListString));
          //localStorage.setItem("userData", JSON.stringify(user_data));
          router.push("/");
        }
      }
    };

    fetchData();
  }, []);

  return <div></div>;
};

export default AuthPage;

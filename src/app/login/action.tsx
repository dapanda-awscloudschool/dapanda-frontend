"use server";
const API_URL = process.env.API_URL_SPRING;
const DJANGO = process.env.API_URL_DJANGO;

export async function LoginAPI(
  memberId: string,
  email: string,
  name: string,
  phoneNum: string,
  address: string
) {
  const memberString = memberId; // `member_string`에 `memberId`를 사용하도록 설정

  const userinfo = JSON.stringify({
    memberId: memberId,
    email: email,
    name: name,
    phoneNum: phoneNum,
    address: address,
    memberString: memberString, // `member_string` 필드를 추가
  });

  const formData = new FormData();
  formData.append(
    "MemberReqInfo",
    new Blob([userinfo], { type: "application/json" })
  );

  // 요청 데이터를 콘솔에 출력하여 확인
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  try {
    const response = await fetch(`${API_URL}/api/spring/member`, {
      method: "POST",
      body: formData,
    });
    return response.text();

    // if (response.status === 200 || response.status === 201) {
    //   const data = await response.json();
    //   return data;
    // } else {
    //   const errorText = await response.text();
    //   console.error(
    //     `HTTP error! status: ${response.status}, message: ${errorText}`
    //   );
    //   throw new Error(
    //     `HTTP error! status: ${response.status}, message: ${errorText}`
    //   );
    // }
  } catch (err) {
    console.error("Error:", err);
    throw Error("Failed to register member");
  }
}

export async function getWishlist(id: string) {
  const res = await fetch(`${DJANGO}/api/django/wishlist/${id}`, {
    method: "GET",
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const productDetail = await res.json();
  return productDetail.product_id;
}

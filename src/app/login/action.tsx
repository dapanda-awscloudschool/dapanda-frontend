"use server";
const API_URL = process.env.API_URL_SPRING;
const DJANGO = process.env.API_URL_DJANGO;

export async function LoginAPI(username: string) {
  const userinfo = JSON.stringify({
    name: username,
  });

  const blob = new Blob([userinfo], { type: "application/json" });
  const formData = new FormData();
  formData.append("MemberLoginReqDto", blob);

  try {
    const response = await fetch(`${API_URL}/api/spring/member`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

export async function getWishlist(id: number) {
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
  //console.log(productDetail);
  return productDetail.product_id;
}

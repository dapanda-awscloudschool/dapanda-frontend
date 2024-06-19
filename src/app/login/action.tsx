"use server";
const API_URL = process.env.API_URL_SPRING;

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

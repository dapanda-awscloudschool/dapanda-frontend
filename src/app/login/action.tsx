"use server";
const API_URL = process.env.API_URL_SPRING;

export async function LoginAPI(
  memberString: string,
  email: string,
  name: string,
  phoneNum: string,
  address: string
) {
  const userinfo = JSON.stringify({
    email: email,
    name: name,
    phoneNum: phoneNum,
    address: address,
    memberString: memberString,
  });

  const formData = new FormData();
  formData.append(
    "MemberReqInfo",
    new Blob([userinfo], { type: "application/json" })
  );

  // 요청 데이터를 콘솔에 출력하여 확인
  // formData.forEach((value, key) => {
  //   console.log(`${key}: ${value}`);
  // });

  try {
    const response = await fetch(`${API_URL}/api/spring/member`, {
      method: "POST",
      body: formData,
    });

    return await response.text();
  } catch (err) {
    console.error("Error:", err);
    throw Error("Failed to register member");
  }
}

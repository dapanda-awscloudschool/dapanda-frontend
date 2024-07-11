import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const {
  COGNITO_DOMAIN,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
  REDIRECT_URI,
} = process.env;

interface DecodedToken {
  identities: Array<{
    userId: string;
    providerName: string;
    providerType: string;
    dateCreated: string;
  }>;
  email: string;
  sub: string;
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      const error = request.nextUrl.searchParams.get("error");
      return NextResponse.json({ error: error || "알 수 없는 오류" });
    }

    console.log("Code:", code); // 디버깅 메시지

    const authorizationHeader = `Basic ${Buffer.from(
      `${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`
    ).toString("base64")}`;

    console.log("Authorization Header:", authorizationHeader); // 디버깅 메시지

    const requestBody = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: COGNITO_APP_CLIENT_ID as string,
      code: code,
      redirect_uri: REDIRECT_URI || "",
    });

    console.log("Request Body:", requestBody.toString()); // 디버깅 메시지

    const res = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authorizationHeader,
      },
      body: requestBody.toString(), // toString() 메서드로 변환
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Token Response Error:", data); // 디버깅 메시지
      return NextResponse.json({
        error: data.error,
        error_description: data.error_description,
      });
    }

    console.log("Token Data:", data); // 디버깅 메시지

    const idToken = data.id_token;
    const decoded: DecodedToken = jwtDecode(idToken);

    const userId = decoded.identities[0].userId;
    const email = decoded.email;

    const userData = {
      memberString: userId,
      email: email,
    };

    const script = `
      localStorage.setItem('tempData', ${JSON.stringify(
        JSON.stringify(userData)
      )});
      window.location.replace('/auth'); // 추가 정보 입력 페이지로 리디렉션
    `;

    return new NextResponse(
      `<!DOCTYPE html><html><head><title>Redirecting...</title></head><body><script>${script}</script></body></html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error: any) {
    console.error("Error:", error); // 디버깅 메시지
    return NextResponse.json({ error: error.message || error });
  }
}

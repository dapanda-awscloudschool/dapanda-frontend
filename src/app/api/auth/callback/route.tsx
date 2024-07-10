import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const { COGNITO_DOMAIN, COGNITO_APP_CLIENT_ID, COGNITO_APP_CLIENT_SECRET } =
  process.env;

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
    const origin = request.nextUrl.origin;
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code") as string;

    if (!code) {
      const error = searchParams.get("error");
      return NextResponse.json({ error: error || "알 수 없는 오류" });
    }

    const authorizationHeader = `Basic ${Buffer.from(
      `${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`
    ).toString("base64")}`;
    const requestBody = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: COGNITO_APP_CLIENT_ID as string,
      code: code,
      redirect_uri: `${origin}/api/auth/callback`,
    });

    console.log("Request Body:", requestBody.toString());

    // 토큰 가져오기
    const res = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authorizationHeader,
      },
      body: requestBody,
    });

    const data = await res.json();

    console.log("Token Response:", data);

    if (!res.ok) {
      console.error("Failed to fetch token:", data);
      return NextResponse.json({
        error: data.error,
        error_description: data.error_description,
      });
    }

    // 토큰을 디코드하여 사용자 정보 추출
    const idToken = data.id_token;
    const decoded: DecodedToken = jwtDecode(idToken);

    // userId를 추출
    const userId = decoded.identities[0].userId;
    const userData = {
      memberId: userId,
      name: decoded.email,
    };

    // 사용자 정보를 localStorage에 저장하는 스크립트 생성
    const script = `
      localStorage.setItem('userData', ${JSON.stringify(
        JSON.stringify(userData)
      )});
      localStorage.setItem('id_token', '${data.id_token}');
      localStorage.setItem('access_token', '${data.access_token}');
      localStorage.setItem('refresh_token', '${data.refresh_token}');
      window.location.replace('/');
    `;

    // 응답으로 스크립트 반환
    return new NextResponse(
      `<!DOCTYPE html><html><head><title>Redirecting...</title></head><body><script>${script}</script></body></html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error: any) {
    // 명시적으로 any 타입으로 지정
    console.error("Error in callback handler:", error.message || error);
    return NextResponse.json({ error: error.message || error });
  }
}

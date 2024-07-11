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

    const res = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authorizationHeader,
      },
      body: requestBody,
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({
        error: data.error,
        error_description: data.error_description,
      });
    }

    const idToken = data.id_token;
    const decoded: DecodedToken = jwtDecode(idToken);

    const userId = decoded.identities[0].userId;
    const email = decoded.email;

    const userData = {
      memberId: userId,
      email: email,
    };

    // 사용자 정보를 localStorage에 저장하는 스크립트 생성
    const script = `
      localStorage.setItem('userData', ${JSON.stringify(
        JSON.stringify(userData)
      )});
      window.location.replace('/RegisterPage'); // 추가 정보 입력 페이지로 리디렉션
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
    return NextResponse.json({ error: error.message || error });
  }
}

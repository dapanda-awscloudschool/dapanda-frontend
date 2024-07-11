import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const { COGNITO_DOMAIN, COGNITO_APP_CLIENT_ID, REDIRECT_URI } = process.env;

export async function GET(request: NextRequest) {
  let authorizeParams = new URLSearchParams();
  const state = crypto.randomBytes(16).toString("hex");

  // 환경 변수가 undefined일 경우를 처리
  if (!COGNITO_APP_CLIENT_ID || !REDIRECT_URI) {
    return NextResponse.json({ error: "환경 변수가 설정되지 않았습니다." });
  }

  authorizeParams.append("response_type", "code");
  authorizeParams.append("client_id", COGNITO_APP_CLIENT_ID);
  authorizeParams.append("redirect_uri", REDIRECT_URI);
  authorizeParams.append("state", state);
  authorizeParams.append("identity_provider", "Google");
  authorizeParams.append("scope", "profile email openid");

  return NextResponse.redirect(
    `${COGNITO_DOMAIN}/oauth2/authorize?${authorizeParams.toString()}`
  );
}

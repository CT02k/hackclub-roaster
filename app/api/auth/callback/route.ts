import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const exchangeReq = fetch("https://hackatime.hackclub.com/oauth/token", {
        method: "POST",
        body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_HACKATIME_CLIENT_ID || "",
            client_secret: process.env.HACKATIME_CLIENT_SECRET || "",
            code: code,
            redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
            grant_type: "authorization_code"
        })
    });

    const data = await (await exchangeReq).json();

    if (!data.access_token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.redirect(new URL("/", request.url)).cookies.set("access_token", data.access_token);
}
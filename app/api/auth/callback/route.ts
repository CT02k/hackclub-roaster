import { Hackatime } from "@/app/lib/hackatime";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        const exchangeData = await Hackatime.exchangeToken({
            client_id: process.env.NEXT_PUBLIC_HACKATIME_CLIENT_ID!,
            client_secret: process.env.HACKATIME_CLIENT_SECRET!,
            code,
            redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
        });

        if (!exchangeData.access_token) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        const response = NextResponse.redirect(new URL("/", request.url));

        response.cookies.set("access_token", exchangeData.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
        });
    
        return response;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.redirect(new URL("/", request.url));
    }
}
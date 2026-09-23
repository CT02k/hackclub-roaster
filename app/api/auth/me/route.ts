import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const access_token = request.cookies.get("access_token")?.value;

    if (!access_token) return Response.json({ response: "Unauthorized" }, { status: 401 });

    const userReq = await fetch("https://hackatime.hackclub.com/api/v1/authenticated/me", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    });

    if (!userReq.ok) return Response.json({ response: "Unauthorized" }, { status: 401 });

    const user = await userReq.json();

    return Response.json({ response: "Authorized", data: user }, { status: 200 });
}
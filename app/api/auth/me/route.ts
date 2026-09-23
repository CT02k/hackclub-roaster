import { Hackatime, HackatimeApiError } from "@/app/lib/hackatime";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const access_token = request.cookies.get("access_token")?.value;

    if (!access_token) return Response.json({ response: "Unauthorized" }, { status: 401 });

    const hackatime = new Hackatime({ access_token });

    try {
        const userData = await hackatime.getUser();

        if (!userData) return Response.json({ response: "Unauthorized" }, { status: 401 });

        return Response.json({ response: "Authorized", data: userData }, { status: 200 });
    } catch (error) {
        if (error instanceof HackatimeApiError) {
            if (error.status === 401) {
                return Response.json({ response: "Unauthorized" }, { status: 401 });
            }
            return Response.json({ response: `Hackatime API error: ${error.status}` }, { status: 502 });
        }

        return Response.json({ response: "Failed to fetch Hackatime user" }, { status: 502 });
    }
}

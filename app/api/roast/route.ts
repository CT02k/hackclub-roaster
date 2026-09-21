import { OpenRouter } from "@openrouter/sdk";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const access_token = request.cookies.get("access_token")?.value;
    
    const or = new OpenRouter({
        apiKey: process.env.HACKCLUB_AI_API_KEY,
        serverURL: "https://ai.hackclub.com/proxy/v1",
    });

    if (!access_token) {
        return new Response("Unauthorized", { status: 401 });
    }

    const aboutUserReq = await fetch("https://hackatime.hackclub.com/api/v1/authenticated/me", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    });

    const aboutUser = await aboutUserReq.json();

    const codingTimeReq = await fetch("https://hackatime.hackclub.com/api/v1/authenticated/hours?start_date=2000-01-01&end_date=" + new Date().toISOString().split('T')[0], {
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
    });

    const codingTime = await codingTimeReq.json();


    const streakReq = await fetch("https://hackatime.hackclub.com/api/v1/authenticated/streak", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
    });

    const streak = await streakReq.json();

    const latestHeartbeatReq = await fetch("https://hackatime.hackclub.com/api/v1/authenticated/heartbeats/latest", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
    });

    const latestHeartbeat = await latestHeartbeatReq.json();

    const response = await or.chat.send({
        chatRequest: {
            model: "openrouter/auto",
            messages: [
                {
                    role: "system",
                    content: "You generates a roast for a user based on their hackclub/hackatime information. The roast should be humorous. Use the user's name and any other relevant information from their profile to make the roast personalized."
                },
                {
                    role: "user",
                    content: `User information: ${JSON.stringify(aboutUser)}. Coding time information (the start date is only used to retrieve all data; the user was probably not even born on this date): ${JSON.stringify(codingTime)}. Streak information: ${JSON.stringify(streak)}. Latest heartbeat information: ${JSON.stringify(latestHeartbeat)}.`
                }
            ],
            stream: false,
        }
    })

    return Response.json({
        response: response.choices[0].message.content
    });

}
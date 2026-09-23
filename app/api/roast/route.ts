import { OpenRouter } from "@openrouter/sdk";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const access_token = request.cookies.get("access_token")?.value;
    
    const or = new OpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY,
    });

    if (!access_token) {
        return Response.json({"response": "Unauthorized"}, { status: 401 });
    }

    const aboutUserReq = await fetch("https://hackatime.hackclub.com/api/v1/authenticated/me", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    });

    const aboutUser = await aboutUserReq.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { trust_factor, ...userWithoutTrustFactor } = aboutUser;

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

    const projectReq = await fetch("https://hackatime.hackclub.com/api/v1/authenticated/projects", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
    });

    const projects = await projectReq.json();

    const latestHeartbeat = await latestHeartbeatReq.json();

    const githubUserReq = await fetch("https://api.github.com/users/" + userWithoutTrustFactor.github_username)

    const githubUser = await githubUserReq.json();

    const githubReposReq = await fetch("https://api.github.com/users/" + userWithoutTrustFactor.github_username + "/repos")

    const githubRepos = await githubReposReq.json();

    const response = await or.chat.send({
        chatRequest: {
            model: "deepseek/deepseek-v4-flash",
            messages: [
                {
                    role: "system",
                    content: "You generates a roast limited at 2000 characters for a user based on their hackclub/hackatime and github information. Don't use markdown. The roast should be humorous. Use the user's name and any other relevant information from their profile to make the roast personalized."
                },
                {
                    role: "user",
                    content: `#Hackatime Data\nUser information: ${JSON.stringify(userWithoutTrustFactor)}. Coding time information: ${codingTime.total_seconds} seconds. Actual streak: ${JSON.stringify(streak)}. Latest heartbeat information: ${JSON.stringify(latestHeartbeat)}. Projects: ${JSON.stringify(projects)}.\n\n#Github Data\nUser information: ${JSON.stringify(githubUser)}. Repositories: ${JSON.stringify(githubRepos)}.`
                }
            ],
            stream: false,
        }
    })

    if (!("choices" in response) || !response.choices[0]?.message) {
        return Response.json({
            response: "Failed to generate roast"
        }, { status: 500 });
    }

    const roast = response.choices[0].message.content

    return Response.json({
        response: roast
    });

}
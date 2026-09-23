import { OpenRouter } from "@openrouter/sdk";
import { Hackatime, HackatimeApiError } from "@/app/lib/hackatime";
import { getGithubUser, getGithubRepos, GitHubApiError } from "@/app/lib/github";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const access_token = request.cookies.get("access_token")?.value;
    
    if (!access_token) {
        return Response.json({"response": "Unauthorized"}, { status: 401 });
    }

    const hackatime = new Hackatime({ access_token });
    let hackatimeData;

    try {
        const user = await hackatime.getUser();
        const [codingTime, streak, latestHeartbeat, projects] = await Promise.all([
            hackatime.getCodingTime({
                start_date: "2000-01-01",
                end_date: new Date().toISOString().split("T")[0],
            }),
            hackatime.getStreak(),
            hackatime.getLatestHeartbeat(),
            hackatime.getProjects(),
        ]);

        hackatimeData = { user, codingTime, streak, latestHeartbeat, projects };
    } catch (error) {
        if (error instanceof HackatimeApiError) {
            if (error.status === 401) {
                return Response.json({ response: "Unauthorized" }, { status: 401 });
            }
            return Response.json({ response: `Hackatime API error: ${error.status}` }, { status: 502 });
        }

        return Response.json({ response: "Failed to fetch Hackatime data" }, { status: 502 });
    }

    const { user, codingTime, streak, latestHeartbeat, projects } = hackatimeData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { trust_factor, ...userWithoutTrustFactor } = user;

    let githubData;

    try {
        githubData = await Promise.all([
            getGithubUser(userWithoutTrustFactor.github_username),
            getGithubRepos(userWithoutTrustFactor.github_username),
        ]);
    } catch (error) {
        if (error instanceof GitHubApiError) {
            return Response.json({ response: `GitHub API error: ${error.status}` }, { status: 502 });
        }

        return Response.json({ response: "Failed to fetch GitHub data" }, { status: 502 });
    }

    const [githubUser, githubRepos] = githubData;

    const openrouter = new OpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY,
    });

    const response = await openrouter.chat.send({
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

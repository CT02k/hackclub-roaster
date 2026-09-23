export interface GitHubUser {
    id: number;
    login: string;
    name: string | null;
    bio: string | null;
    html_url: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
}

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    fork: boolean;
    archived: boolean;
}

export class GitHubApiError extends Error {
    constructor(public readonly status: number) {
        super(`GitHub request failed: ${status}`);
        this.name = "GitHubApiError";
    }
}

async function githubRequest<T>(path: string): Promise<T> {
    const response = await fetch(`https://api.github.com/${path}`);

    if (!response.ok) throw new GitHubApiError(response.status);

    return response.json();
}

export function getGithubUser(username: string): Promise<GitHubUser> {
    return githubRequest(`users/${encodeURIComponent(username)}`);
}

export function getGithubRepos(username: string): Promise<GitHubRepo[]> {
    return githubRequest(`users/${encodeURIComponent(username)}/repos`);
}

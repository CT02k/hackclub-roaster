export type HackatimeScope = "profile" | "read" | "admin";

export type HackatimeDate = string;

export interface HackatimeUser {
    id: number;
    emails: string[];
    slack_id: string;
    github_username: string;
    trust_factor: {
    trust_level: string;
    trust_value: number;
    };
}

export interface HackatimeHoursParams {
    start_date?: HackatimeDate;
    end_date?: HackatimeDate;
}

export interface HackatimeHours {
    start_date: HackatimeDate;
    end_date: HackatimeDate;
    total_seconds: number;
}

export interface HackatimeStreak {
    streak_days: number;
}

export interface HackatimeProjectsParams {
    include_archived?: boolean;
}

export interface HackatimeProject {
    name: string;
    total_seconds: number;
    most_recent_heartbeat: string;
    languages: string[];
    archived: boolean;
}

export interface HackatimeProjects {
    projects: HackatimeProject[];
}

export interface HackatimeHeartbeat {
    id: number;
    created_at: string;
    time: number;
    category: string;
    project: string;
    language: string;
    editor: string;
    operating_system: string;
    machine: string;
    entity: string;
}

export type HackatimeLatestHeartbeat =
    | HackatimeHeartbeat
    | { heartbeat: null };

export interface HackatimeApiKey {
    token: string;
}

export interface HackatimeOAuthToken {
    access_token: string;
    token_type: "Bearer";
    expires_in: number;
    scope: string;
    created_at: number;
}

export interface HackatimeOptions {
    access_token: string;
}

export interface HackatimeExchangeTokenOptions {
    client_id: string;
    client_secret: string;
    code: string;
    redirect_uri: string;
}

export class HackatimeApiError extends Error {
    constructor(public readonly status: number) {
        super(`Hackatime request failed: ${status}`);
        this.name = "HackatimeApiError";
    }
}

export class Hackatime {
    private readonly accessToken: string;
    private readonly baseUrl = "https://hackatime.hackclub.com/api/v1/authenticated";

    constructor(options: HackatimeOptions) {
        this.accessToken = options.access_token;
    }

    static async exchangeToken(options: HackatimeExchangeTokenOptions): Promise<HackatimeOAuthToken> {
        const response = await fetch("https://hackatime.hackclub.com/oauth/token", {
            method: "POST",
            body: new URLSearchParams({
                client_id: options.client_id,
                client_secret: options.client_secret,
                code: options.code,
                redirect_uri: options.redirect_uri,
                grant_type: "authorization_code"
            })
        });

        return Hackatime.parseResponse<HackatimeOAuthToken>(response);
    }

    async getUser(): Promise<HackatimeUser> {
        return this.makeRequest("me");
    }

    async getCodingTime(params?: HackatimeHoursParams): Promise<HackatimeHours> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return this.makeRequest(`hours?${query}`);
    }

    async getStreak(): Promise<HackatimeStreak> {
        return this.makeRequest("streak");
    }

    async getLatestHeartbeat(): Promise<HackatimeLatestHeartbeat> {
        return this.makeRequest("heartbeats/latest");
    }

    async getProjects(params?: HackatimeProjectsParams): Promise<HackatimeProjects> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return this.makeRequest(`projects?${query}`);
    }

    private async makeRequest<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            headers: { Authorization: `Bearer ${this.accessToken}` }
        });

        return Hackatime.parseResponse<T>(response);
    }

    private static async parseResponse<T>(response: Response): Promise<T> {
        if (!response.ok) throw new HackatimeApiError(response.status);

        return response.json();
    }
}

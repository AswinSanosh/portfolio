import { NextResponse } from "next/server";

const BASE = "https://api.github.com";

async function ghFetch(url: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { headers, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
  return res.json();
}

async function ghGraphQL(query: string, token: string) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GraphQL ${res.status}: ${res.statusText}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message ?? "GraphQL error");
  return json.data;
}

function buildContribQuery(username: string, from?: string, to?: string) {
  const range = from && to ? `(from: "${from}", to: "${to}")` : "";
  return `query {
    user(login: "${username}") {
      contributionsCollection${range} {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;
  const yearParam = searchParams.get("year");

  if (!username) {
    return NextResponse.json({ error: "GITHUB_USERNAME not configured" }, { status: 400 });
  }

  // Lightweight: if year param is provided, only fetch contribution data for that year
  if (yearParam && token) {
    try {
      const y = parseInt(yearParam);
      const now = new Date();
      const from = `${y}-01-01T00:00:00Z`;
      const to = y === now.getFullYear()
        ? now.toISOString()
        : `${y}-12-31T23:59:59Z`;
      const data = await ghGraphQL(buildContribQuery(username, from, to), token);
      const col = data?.user?.contributionsCollection;
      if (!col) return NextResponse.json({ error: "No data" }, { status: 404 });
      const contributionCalendar = col.contributionCalendar.weeks.flatMap(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (w: any) => w.contributionDays.map((d: any) => ({ date: d.date, count: d.contributionCount, color: d.color }))
      );
      return NextResponse.json({
        contributionCalendar,
        totalContributions: col.contributionCalendar.totalContributions,
        totalCommits: col.totalCommitContributions,
        totalPRs: col.totalPullRequestContributions,
        totalIssues: col.totalIssueContributions,
      });
    } catch (err: unknown) {
      return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 });
    }
  }

  try {
    const reposEndpoint = token
      ? `${BASE}/user/repos?per_page=100&sort=updated&type=all`
      : `${BASE}/users/${username}/repos?per_page=100&sort=updated`;

    // Fetch REST data + GraphQL contribution calendar in parallel
    const now = new Date();
    const currentYear = now.getFullYear();
    const from = `${currentYear}-01-01T00:00:00Z`;
    const to = now.toISOString();

    const [user, repos, events, contributionData, allTimeData] = await Promise.all([
      ghFetch(`${BASE}/users/${username}`, token),
      ghFetch(reposEndpoint, token),
      ghFetch(`${BASE}/users/${username}/events/public?per_page=100`, token),
      token
        ? ghGraphQL(buildContribQuery(username, from, to), token)
        : Promise.resolve(null),
      // All-time totals (no date range = lifetime)
      token
        ? ghGraphQL(buildContribQuery(username), token)
        : Promise.resolve(null),
    ]);

    // Build contribution calendar from GraphQL (full year)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let contributionCalendar: { date: string; count: number; color: string }[] = [];
    let totalContributions = 0;
    let totalCommits = 0;
    let totalPRs = 0;
    let totalIssues = 0;

    // All-time lifetime totals
    let allTimeContributions = 0;
    let allTimeCommits = 0;
    let allTimePRs = 0;
    let allTimeIssues = 0;

    if (allTimeData?.user?.contributionsCollection) {
      const atCol = allTimeData.user.contributionsCollection;
      allTimeContributions = atCol.contributionCalendar.totalContributions;
      allTimeCommits = atCol.totalCommitContributions;
      allTimePRs = atCol.totalPullRequestContributions;
      allTimeIssues = atCol.totalIssueContributions;
    }

    if (contributionData?.user?.contributionsCollection) {
      const col = contributionData.user.contributionsCollection;
      totalContributions = col.contributionCalendar.totalContributions;
      totalCommits = col.totalCommitContributions;
      totalPRs = col.totalPullRequestContributions;
      totalIssues = col.totalIssueContributions;
      contributionCalendar = col.contributionCalendar.weeks.flatMap(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (w: any) => w.contributionDays.map((d: any) => ({
          date: d.date,
          count: d.contributionCount,
          color: d.color,
        }))
      );
    } else {
      // Fallback: build from events API (limited to ~90 days)
      const pushDatesMap: Record<string, number> = {};
      events
        .filter((e: { type: string }) => e.type === "PushEvent")
        .forEach((e: { created_at?: string; payload?: { commits?: unknown[] } }) => {
          const date = e.created_at?.slice(0, 10);
          if (date) pushDatesMap[date] = (pushDatesMap[date] || 0) + (e.payload?.commits?.length || 1);
        });
      const today = new Date();
      for (let d = 365; d >= 0; d--) {
        const dt = new Date(today);
        dt.setDate(today.getDate() - d);
        const key = dt.toISOString().slice(0, 10);
        const count = pushDatesMap[key] || 0;
        contributionCalendar.push({ date: key, count, color: count > 0 ? "#26a641" : "#161b22" });
      }
    }

    // Language aggregation
    const langBytes: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) langBytes[repo.language] = (langBytes[repo.language] || 0) + (repo.size || 1);
    }
    const totalBytes = Object.values(langBytes).reduce((a: number, b: number) => a + b, 0);
    const languages = Object.entries(langBytes)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 8)
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round(((bytes as number) / totalBytes) * 100),
      }));

    // All repos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allRepos = [...repos]
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((r: any) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        url: r.html_url,
        updatedAt: r.updated_at,
        isPrivate: r.private,
        isForked: r.fork,
        size: r.size,
      }));

    const topRepos = allRepos.slice(0, 6);
    const privateCount = token ? repos.filter((r: { private: boolean }) => r.private).length : null;

    // Recent commits from events
    const recentCommits = events
      .filter((e: { type: string }) => e.type === "PushEvent")
      .slice(0, 15)
      .flatMap((e: { payload?: { commits?: { message: string }[] }; repo?: { name?: string }; created_at?: string }) =>
        (e.payload?.commits || []).slice(0, 2).map((c) => ({
          message: c.message.split("\n")[0].slice(0, 70),
          repo: e.repo?.name?.split("/")[1] || "",
          date: e.created_at,
        }))
      )
      .slice(0, 10);

    const totalStars = repos.reduce((acc: number, r: { stargazers_count?: number }) => acc + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((acc: number, r: { forks_count?: number }) => acc + (r.forks_count || 0), 0);

    return NextResponse.json({
      user: {
        name: user.name || username,
        login: user.login,
        bio: user.bio,
        avatar: user.avatar_url,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        url: user.html_url,
        location: user.location,
        createdAt: user.created_at,
        blog: user.blog,
      },
      stats: {
        totalRepos: repos.length,
        privateRepos: privateCount,
        totalStars,
        totalForks,
        languageCount: languages.length,
        totalContributions,
        totalCommits,
        totalPRs,
        totalIssues,
        allTimeContributions,
        allTimeCommits,
        allTimePRs,
        allTimeIssues,
      },
      languages,
      topRepos,
      allRepos,
      contributionCalendar,
      recentCommits,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

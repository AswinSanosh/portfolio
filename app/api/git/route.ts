import { NextResponse } from "next/server";

const BASE = "https://api.github.com";

export async function GET() {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  const fallback = { branch: "main", commits: null, tag: null, repo: null, status: "clean" };

  if (!username || !token) return NextResponse.json(fallback);

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${token}`,
  };

  try {
    // Find portfolio repo by looking for common naming patterns
    const reposRes = await fetch(`${BASE}/user/repos?per_page=100&sort=updated&type=owner`, {
      headers,
      next: { revalidate: 3600 },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const repos: any[] = await reposRes.json();

    const firstName = username.toLowerCase();
    const portfolioRepo = repos.find((r) =>
      ["portfolio", `${firstName}.dev`, `${firstName}-dev`, username.toLowerCase()].includes(r.name.toLowerCase()) ||
      r.name.toLowerCase().includes("portfolio")
    );

    if (!portfolioRepo) return NextResponse.json(fallback);

    const repoName = portfolioRepo.name as string;
    const branch = portfolioRepo.default_branch as string;

    // Get commit count via Link header trick
    const commitsRes = await fetch(
      `${BASE}/repos/${username}/${repoName}/commits?per_page=1&sha=${branch}`,
      { headers, next: { revalidate: 3600 } }
    );
    const linkHeader = commitsRes.headers.get("link") ?? "";
    const match = linkHeader.match(/[?&]page=(\d+)>; rel="last"/);
    const commits = match ? parseInt(match[1]) : 1;

    // Get latest tag
    const tagsRes = await fetch(
      `${BASE}/repos/${username}/${repoName}/tags?per_page=1`,
      { headers, next: { revalidate: 3600 } }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tags: any[] = await tagsRes.json();
    const tag: string | null = Array.isArray(tags) && tags[0]?.name ? tags[0].name : null;

    return NextResponse.json({ branch, commits, tag, repo: repoName, status: "clean" });
  } catch {
    return NextResponse.json(fallback);
  }
}

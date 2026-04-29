"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Star, GitFork, MapPin, Link2, Calendar, Users, Package,
  Search, X, ExternalLink, Globe, Github,
} from "lucide-react";

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Shell: "#89e051",
  Vue: "#41b883",
  PHP: "#4F5D95",
};

interface Repo {
  name: string; description: string; language: string;
  stars: number; forks: number; url: string;
  updatedAt: string; isPrivate: boolean; isForked: boolean; size: number;
}

interface GithubData {
  user: {
    name: string; login: string; bio: string; avatar: string;
    followers: number; following: number; publicRepos: number;
    url: string; location: string; createdAt: string; blog: string;
  };
  stats: {
    totalRepos: number; privateRepos: number | null;
    totalStars: number; totalForks: number; languageCount: number;
    totalContributions: number; totalCommits: number; totalPRs: number; totalIssues: number;
    allTimeContributions: number; allTimeCommits: number; allTimePRs: number; allTimeIssues: number;
  };
  languages: { name: string; percentage: number }[];
  topRepos: Repo[];
  allRepos: Repo[];
  recentCommits: { message: string; repo: string; date: string }[];
  contributionCalendar: { date: string; count: number; color: string }[];
}

type SortKey = "stars" | "updated" | "name" | "forks";

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col p-3 rounded-lg bg-vscode-sidebar border border-vscode-border hover:border-vscode-blue/50 transition-all hover:bg-vscode-hover group"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {repo.isPrivate
            ? <Lock size={11} className="text-vscode-muted shrink-0" />
            : <Github size={11} className="text-vscode-muted shrink-0" />
          }
          <span className="text-vscode-cyan text-xs font-semibold truncate group-hover:text-vscode-blue transition-colors">
            {repo.name}
          </span>
          {repo.isForked && <span className="text-[10px] text-vscode-muted shrink-0 border border-vscode-border rounded px-1">fork</span>}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-vscode-muted shrink-0">
          {repo.stars > 0 && <span className="flex items-center gap-0.5"><Star size={10} />{repo.stars}</span>}
          {repo.forks > 0 && <span className="flex items-center gap-0.5"><GitFork size={10} />{repo.forks}</span>}
        </div>
      </div>

      <p className="text-[11px] text-vscode-muted leading-relaxed flex-1 line-clamp-2 mb-2">
        {repo.description || <span className="italic opacity-50">No description</span>}
      </p>

      <div className="flex items-center justify-between mt-auto">
        {repo.language ? (
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: LANG_COLORS[repo.language] ?? "#858585" }}
            />
            <span className="text-[10px] text-vscode-muted">{repo.language}</span>
          </div>
        ) : <span />}
        <span className="text-[10px] text-vscode-muted">
          {new Date(repo.updatedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
        </span>
      </div>
    </a>
  );
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-vscode-border rounded ${className}`} />;
}

interface ContribData {
  contributionCalendar: { date: string; count: number; color: string }[];
  totalContributions: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
}

function ContributionGraph({
  calendar,
  totalContributions,
  totalCommits,
  totalPRs,
  totalIssues,
  joinYear,
}: {
  calendar: { date: string; count: number; color: string }[];
  totalContributions: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  joinYear: number;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - joinYear + 1 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [yearData, setYearData] = useState<ContribData | null>(null);
  const [yearLoading, setYearLoading] = useState(false);

  const activeCalendar = selectedYear === currentYear && !yearData ? calendar : yearData?.contributionCalendar ?? [];
  const activeTotal = selectedYear === currentYear && !yearData ? totalContributions : yearData?.totalContributions ?? 0;
  const activeCommits = selectedYear === currentYear && !yearData ? totalCommits : yearData?.totalCommits ?? 0;
  const activePRs = selectedYear === currentYear && !yearData ? totalPRs : yearData?.totalPRs ?? 0;
  const activeIssues = selectedYear === currentYear && !yearData ? totalIssues : yearData?.totalIssues ?? 0;

  const selectYear = async (y: number) => {
    setSelectedYear(y);
    setYearData(null);
    if (y === currentYear) return;
    setYearLoading(true);
    try {
      const res = await fetch(`/api/github?year=${y}`);
      const json = await res.json();
      if (!json.error) setYearData(json as ContribData);
    } finally {
      setYearLoading(false);
    }
  };


  const calMap: Record<string, { count: number; color: string }> = {};
  for (const d of activeCalendar) calMap[d.date] = { count: d.count, color: d.color };

  // Build full calendar grid for selected year
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const isCurrentYear = selectedYear === currentYear;
  // Hard end: Dec 31 for past years, today for current year
  const hardEnd = isCurrentYear ? todayStr : `${selectedYear}-12-31`;
  const yearStart = new Date(`${selectedYear}-01-01`);
  // Align start to the Sunday on or before Jan 1
  const startDow = yearStart.getDay();
  const start = new Date(yearStart);
  start.setDate(yearStart.getDate() - startDow);
  // Always end on the Saturday of the last week
  const hardEndDate = new Date(hardEnd);
  const endDow = hardEndDate.getDay(); // 0=Sun … 6=Sat
  const gridEnd = new Date(hardEndDate);
  gridEnd.setDate(hardEndDate.getDate() + (6 - endDow));

  // Build weeks — always 7 cells per week, out-of-range = dark empty
  const weeks: { date: string; count: number; color: string; outOfRange: boolean }[][] = [];
  const cur = new Date(start);
  while (cur <= gridEnd) {
    const week: { date: string; count: number; color: string; outOfRange: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const key = cur.toISOString().slice(0, 10);
      const outOfRange = key > hardEnd || key < `${selectedYear}-01-01`;
      const entry = outOfRange ? undefined : calMap[key];
      week.push({ date: key, count: entry?.count ?? 0, color: outOfRange ? "#0d1117" : (entry?.color ?? "#161b22"), outOfRange });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  // Month labels — only show months that belong to selectedYear
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, ci) => {
    const firstInYear = week.find((d) => !d.outOfRange && d.date >= `${selectedYear}-01-01`);
    if (!firstInYear) return;
    const m = new Date(firstInYear.date).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ label: new Date(firstInYear.date).toLocaleDateString("en-US", { month: "short" }), col: ci });
      lastMonth = m;
    }
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-[11px] text-vscode-muted uppercase tracking-wider font-semibold">
          Contribution Activity
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Year selector */}
          <div className="flex gap-1 flex-wrap">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => selectYear(y)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  selectedYear === y
                    ? "bg-vscode-green/20 text-vscode-green border border-vscode-green/40"
                    : "text-vscode-muted hover:text-vscode-text border border-transparent hover:border-vscode-border"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-vscode-green font-semibold">
            {yearLoading ? "..." : activeTotal.toLocaleString()} contributions
          </div>
        </div>
      </div>

      {/* Contribution type stats */}
      {!yearLoading && (activeCommits > 0 || activePRs > 0 || activeIssues > 0) && (
        <div className="flex gap-3 flex-wrap text-[11px]">
          <span className="text-vscode-muted">Commits: <span className="text-vscode-cyan font-semibold">{activeCommits.toLocaleString()}</span></span>
          <span className="text-vscode-muted">PRs: <span className="text-vscode-purple font-semibold">{activePRs.toLocaleString()}</span></span>
          <span className="text-vscode-muted">Issues: <span className="text-vscode-orange font-semibold">{activeIssues.toLocaleString()}</span></span>
        </div>
      )}

      <div className={`overflow-x-auto relative ${yearLoading ? "opacity-40 pointer-events-none" : ""} transition-opacity`}>
        {/* Day-of-week labels + grid */}
        <div className="flex gap-1">
          {/* DOW labels */}
          <div className="flex flex-col gap-[3px] mr-0.5 mt-[14px]">
            {["", "M", "", "W", "", "F", ""].map((d, i) => (
              <div key={i} className="w-2 h-[11px] text-[9px] text-vscode-muted leading-none flex items-center justify-end pr-0.5">
                {d}
              </div>
            ))}
          </div>

          {/* Week columns */}
          <div className="flex gap-[3px]">
            {weeks.map((week, ci) => {
              const monthLabel = monthLabels.find((m) => m.col === ci);
              return (
              <div key={ci} className="flex flex-col gap-[3px]">
                {/* Month label above column */}
                <div className="h-[11px] text-[9px] text-vscode-muted leading-none overflow-visible whitespace-nowrap">
                  {monthLabel ? monthLabel.label : ""}
                </div>
                {week.map((cell) => {
                  const isToday = cell.date === todayStr;
                  return (
                    <div
                      key={cell.date}
                      title={cell.outOfRange ? "" : `${cell.date}: ${cell.count} contribution${cell.count !== 1 ? "s" : ""}`}
                      className={`w-[11px] h-[11px] rounded-sm transition-opacity ${cell.outOfRange ? "opacity-0" : "cursor-default hover:opacity-75"} ${isToday ? "ring-1 ring-vscode-blue/60" : ""}`}
                      style={{ backgroundColor: cell.color }}
                    />
                  );
                })}
              </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-vscode-muted">
        <span>Less</span>
        {["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"].map((c) => (
          <div key={c} className="w-[11px] h-[11px] rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}


function RepoBrowser({ repos, topRepos }: { repos: Repo[]; topRepos: Repo[] }) {
  const [search, setSearch] = useState("");
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("stars");
  const [showAll, setShowAll] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"all" | "public" | "private" | "fork">("all");

  const allLangs = useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((r) => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
    return Object.entries(counts).sort(([, a], [, b]) => b - a).map(([lang, count]) => ({ lang, count }));
  }, [repos]);

  const filtered = useMemo(() => {
    let list = [...repos];
    if (typeFilter === "public")  list = list.filter((r) => !r.isPrivate && !r.isForked);
    if (typeFilter === "private") list = list.filter((r) => r.isPrivate);
    if (typeFilter === "fork")    list = list.filter((r) => r.isForked);
    if (activeLang) list = list.filter((r) => r.language === activeLang);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        (r.language ?? "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "stars")   return b.stars - a.stars;
      if (sort === "forks")   return b.forks - a.forks;
      if (sort === "updated") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sort === "name")    return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [repos, search, activeLang, sort, typeFilter]);

  const visible = showAll ? filtered : filtered.slice(0, 12);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-vscode-muted uppercase tracking-wider font-semibold">
          All Repositories
          <span className="ml-2 text-vscode-blue">{filtered.length}</span>
          {filtered.length !== repos.length && <span className="text-vscode-muted"> / {repos.length}</span>}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-vscode-muted pointer-events-none" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowAll(false); }}
          placeholder="Search by name, description, language..."
          className="w-full bg-vscode-sidebar border border-vscode-border rounded-lg pl-8 pr-8 py-2 text-xs text-vscode-text placeholder:text-vscode-muted outline-none focus:border-vscode-blue transition-colors"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-vscode-muted hover:text-vscode-text">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Type filter + Sort */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1.5">
          {(["all", "public", "private", "fork"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTypeFilter(t); setShowAll(false); }}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors capitalize ${
                typeFilter === t
                  ? "bg-vscode-blue text-white"
                  : "bg-vscode-sidebar border border-vscode-border text-vscode-muted hover:text-vscode-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-vscode-muted">
          <span>Sort:</span>
          {(["stars", "updated", "name", "forks"] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-2 py-0.5 rounded capitalize transition-colors ${
                sort === s ? "text-vscode-cyan" : "hover:text-vscode-text"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Language filter chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => { setActiveLang(null); setShowAll(false); }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
            !activeLang ? "bg-vscode-highlight border-vscode-blue text-vscode-cyan" : "border-vscode-border text-vscode-muted hover:text-vscode-text"
          }`}
        >
          All languages
        </button>
        {allLangs.map(({ lang, count }) => (
          <button
            key={lang}
            onClick={() => { setActiveLang(activeLang === lang ? null : lang); setShowAll(false); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border transition-all ${
              activeLang === lang
                ? "bg-vscode-highlight border-vscode-blue text-vscode-cyan"
                : "border-vscode-border text-vscode-muted hover:text-vscode-text hover:border-vscode-blue/40"
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LANG_COLORS[lang] ?? "#858585" }} />
            {lang}
            <span className="opacity-60">{count}</span>
          </button>
        ))}
      </div>

      {/* Repo grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-vscode-muted text-sm">
          No repositories match your search.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {visible.map((repo, i) => (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                >
                  <RepoCard repo={repo} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length > 12 && (
            <button
              onClick={() => setShowAll((p) => !p)}
              className="w-full py-2 text-xs text-vscode-muted hover:text-vscode-text border border-vscode-border rounded-lg hover:border-vscode-blue/40 transition-colors"
            >
              {showAll ? `▲ Show less` : `▼ Show all ${filtered.length} repositories`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

export default function GithubFile() {
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
        <Skeleton className="h-32" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-lg mx-auto space-y-4">
        <div className="p-4 rounded-lg border border-vscode-red/40 bg-vscode-red/10 text-vscode-red text-sm">
          <div className="font-semibold mb-1">GitHub API Error</div>
          <div className="text-xs opacity-80">{error}</div>
        </div>
        <button onClick={() => { setError(null); setLoading(true); fetch("/api/github").then(r=>r.json()).then(d=>{ setData(d); setLoading(false); }).catch(()=>setLoading(false)); }} className="text-xs text-vscode-blue hover:underline">
          ↺ Retry
        </button>
      </div>
    );
  }

  if (!data) return null;
  const { user, stats, languages, topRepos, allRepos, recentCommits, contributionCalendar } = data;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6 text-sm pb-16">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="font-mono text-xs">
        <span className="code-comment">{`// github/${user.login}.ts — live data`}</span>
      </motion.div>

      {/* Profile card */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show">
        <div className="flex items-start gap-5 p-5 rounded-xl border border-vscode-border bg-vscode-sidebar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-vscode-blue/40"
          />
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold text-lg">{user.name}</span>
              <a href={user.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-vscode-muted text-sm hover:text-vscode-blue transition-colors">
                @{user.login}
                <ExternalLink size={11} />
              </a>
            </div>
            {user.bio && <div className="text-vscode-muted text-xs">{user.bio}</div>}
            <div className="flex flex-wrap gap-3 text-[11px] text-vscode-muted pt-1">
              {user.location && <span className="flex items-center gap-1"><MapPin size={11} />{user.location}</span>}
              {user.blog && <a href={user.blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-vscode-blue hover:underline"><Link2 size={11} />{user.blog}</a>}
              <span className="flex items-center gap-1"><Calendar size={11} />Joined {new Date(user.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Public Repos",   value: user.publicRepos,             color: "text-vscode-blue",   Icon: Package },
            { label: "Private Repos",  value: stats.privateRepos ?? "N/A",  color: "text-vscode-pink",   Icon: Lock    },
            { label: "Total Stars",    value: stats.totalStars,             color: "text-vscode-yellow", Icon: Star    },
            { label: "Followers",      value: user.followers,               color: "text-vscode-green",  Icon: Users   },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-lg bg-vscode-sidebar border border-vscode-border text-center hover:border-vscode-blue/40 transition-colors">
              <div className="flex justify-center mb-1"><s.Icon size={20} className={s.color} /></div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-vscode-muted text-[11px]">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Extra stats row */}
      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: "Total Repos",    value: stats.totalRepos,                                      color: "text-vscode-cyan"   },
            { label: "Total Forks",    value: stats.totalForks,                                      color: "text-vscode-orange" },
            { label: "Languages",      value: stats.languageCount,                                   color: "text-vscode-purple" },
            { label: "Contributions",  value: (stats.allTimeContributions || stats.totalContributions).toLocaleString(), color: "text-vscode-green"  },
            { label: "Commits",        value: (stats.allTimeCommits || stats.totalCommits).toLocaleString(),             color: "text-vscode-blue"   },
            { label: "Pull Requests",  value: (stats.allTimePRs || stats.totalPRs).toLocaleString(),                     color: "text-vscode-pink"   },
          ].map((s) => (
            <div key={s.label} className="p-2 sm:p-3 rounded-lg bg-vscode-sidebar border border-vscode-border text-center min-w-0">
              <div className={`text-lg font-bold ${s.color} truncate`}>{s.value}</div>
              <div className="text-vscode-muted text-[10px] sm:text-[11px] truncate" title={s.label}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contribution graph */}
      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show">
        <div className="p-4 rounded-xl bg-vscode-sidebar border border-vscode-border">
          <ContributionGraph
            calendar={contributionCalendar}
            totalContributions={stats.totalContributions ?? 0}
            totalCommits={stats.totalCommits ?? 0}
            totalPRs={stats.totalPRs ?? 0}
            totalIssues={stats.totalIssues ?? 0}
            joinYear={new Date(user.createdAt).getFullYear()}
          />
        </div>
      </motion.div>

      {/* Languages */}
      {languages.length > 0 && (
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show" className="space-y-3">
          <div className="text-[11px] text-vscode-muted uppercase tracking-wider font-semibold">Languages</div>

          {/* Stacked bar */}
          <div className="h-3 rounded-full overflow-hidden flex">
            {languages.map((l) => (
              <motion.div
                key={l.name}
                initial={{ width: 0 }}
                animate={{ width: `${l.percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                style={{ backgroundColor: LANG_COLORS[l.name] ?? "#858585" }}
                title={`${l.name}: ${l.percentage}%`}
                className="h-full"
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {languages.map((l, i) => (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 + 0.4 }}
                className="flex items-center gap-1.5 text-xs"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: LANG_COLORS[l.name] ?? "#858585" }}
                />
                <span className="text-vscode-text">{l.name}</span>
                <span className="text-vscode-muted">{l.percentage}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Full Repository Browser */}
      {allRepos.length > 0 && (
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="show">
          <RepoBrowser repos={allRepos} topRepos={topRepos} />
        </motion.div>
      )}

      {/* Recent commits */}
      {recentCommits.length > 0 && (
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="show" className="space-y-3">
          <div className="text-[11px] text-vscode-muted uppercase tracking-wider font-semibold">Recent Commits</div>
          <div className="space-y-1.5">
            {recentCommits.map((commit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.3 }}
                className="flex items-start gap-3 p-2.5 rounded bg-vscode-sidebar border border-vscode-border hover:border-vscode-border/80 transition-colors"
              >
                <Github size={12} className="text-vscode-green mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-vscode-text truncate">{commit.message}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-vscode-cyan">{commit.repo}</span>
                    <span className="text-[10px] text-vscode-muted">
                      {commit.date ? new Date(commit.date).toLocaleDateString("en-IN") : ""}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

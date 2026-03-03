"use client"

import { useEffect, useState } from "react"
import { GitBranch, GitCommit, ExternalLink, RefreshCw, Github } from "lucide-react"

type Commit = { sha: string; message: string; date: string; author: string }
type Repo = { name: string; url: string; updatedAt: string; description: string; commits: Commit[]; prs: any[]; issues: any[] }

export default function GitHubPanel() {
  const [data, setData] = useState<{ repos: Repo[]; fetchedAt: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRepo, setSelectedRepo] = useState(0)

  const fetch_ = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/github")
      setData(await res.json())
    } finally { setLoading(false) }
  }

  useEffect(() => { fetch_() }, [])

  const repo = data?.repos[selectedRepo]

  return (
    <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-purple-400" />
          <span className="text-white font-semibold text-sm">GitHub</span>
          {data?.fetchedAt && (
            <span className="text-slate-600 text-xs">
              {new Date(data.fetchedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
        <button onClick={fetch_} className="text-slate-600 hover:text-slate-400 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Repo tabs */}
      {data?.repos && (
        <div className="flex gap-2">
          {data.repos.map((r, i) => (
            <button
              key={r.name}
              onClick={() => setSelectedRepo(i)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedRepo === i
                  ? "bg-purple-400/20 text-purple-400 border border-purple-400/30"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}

      {loading && !data && (
        <div className="text-slate-600 text-xs text-center py-4">Loading GitHub data...</div>
      )}

      {repo && (
        <div className="space-y-3">
          {/* Repo link */}
          <a href={repo.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan-400 text-xs hover:underline">
            <ExternalLink className="w-3 h-3" /> {repo.url.replace("https://github.com/", "")}
          </a>

          {/* Recent commits */}
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-2">
              <GitCommit className="w-3 h-3" /> Recent Commits
            </div>
            <div className="space-y-2">
              {repo.commits.slice(0, 5).map((c) => (
                <div key={c.sha} className="flex items-start gap-2">
                  <span className="font-mono text-purple-400 text-xs mt-0.5 shrink-0">{c.sha}</span>
                  <div className="min-w-0">
                    <div className="text-slate-300 text-xs truncate">{c.message.split("\n")[0]}</div>
                    <div className="text-slate-600 text-xs">{new Date(c.date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PRs & Issues counts */}
          <div className="flex gap-4 pt-1 border-t border-[#1a1a2e]">
            <div className="text-xs">
              <span className="text-slate-500">Open PRs </span>
              <span className="text-white font-medium">{repo.prs?.filter((p: any) => p.state === "OPEN").length ?? 0}</span>
            </div>
            <div className="text-xs">
              <span className="text-slate-500">Open Issues </span>
              <span className="text-white font-medium">{repo.issues?.filter((i: any) => i.state === "OPEN").length ?? 0}</span>
            </div>
            <div className="text-xs">
              <span className="text-slate-500">Branch </span>
              <span className="text-cyan-400 font-medium font-mono">main</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

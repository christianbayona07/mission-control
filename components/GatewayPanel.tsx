"use client"

import { useEffect, useState } from "react"
import { Activity, RefreshCw, Wifi, Terminal } from "lucide-react"

type Session = {
  id: string
  key: string
  model: string
  tokens: number
  contextTokens: number
  updatedAt: string
  channel: string
}

const CHANNEL_COLOR: Record<string, string> = {
  telegram: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  cron: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  main: "text-purple-400 bg-purple-400/10 border-purple-400/20",
}

export default function GatewayPanel() {
  const [data, setData] = useState<{ active: Session[]; totalSessions: number; fetchedAt: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/gateway")
      setData(await res.json())
    } finally { setLoading(false) }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-green-400" />
          <span className="text-white font-semibold text-sm">OpenClaw Gateway</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          {data && (
            <span className="text-slate-600 text-xs font-mono">{data.totalSessions} total sessions</span>
          )}
          <button onClick={fetchData} className="text-slate-600 hover:text-slate-400 transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading && !data && (
        <div className="text-slate-600 text-xs text-center py-4">Connecting to gateway...</div>
      )}

      {data?.active.length === 0 && (
        <div className="text-slate-600 text-xs text-center py-4">No active sessions in the last hour</div>
      )}

      {data && data.active.length > 0 && (
        <div className="space-y-2">
          <div className="text-slate-500 font-mono text-xs tracking-wider">ACTIVE SESSIONS</div>
          {data.active.map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-[#0a0a0f] rounded-lg px-3 py-2 border border-[#1a1a2e]">
              <div className="flex items-center gap-2 min-w-0">
                <Terminal className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="text-slate-300 text-xs font-mono truncate max-w-[160px]">
                  {s.key?.split(":").slice(-1)[0] ?? s.id.slice(0, 8)}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${CHANNEL_COLOR[s.channel] ?? CHANNEL_COLOR.main}`}>
                  {s.channel}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">{s.contextTokens ? Math.round(s.contextTokens/2000) + "%" : "—"}%</div>
                  <div className="text-xs text-slate-600">ctx</div>
                </div>
                <div className="text-xs text-slate-600">
                  {new Date(s.updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data?.fetchedAt && (
        <div className="text-slate-700 text-xs text-right">
          synced {new Date(data.fetchedAt).toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}

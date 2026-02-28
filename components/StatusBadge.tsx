import { AgentStatus } from "@/lib/types"

const config: Record<AgentStatus, { label: string; color: string; dot: string }> = {
  active: { label: "ACTIVE", color: "text-green-400 border-green-400/40 bg-green-400/10", dot: "bg-green-400 shadow-[0_0_6px_#00ff88]" },
  available: { label: "AVAILABLE", color: "text-cyan-400 border-cyan-400/40 bg-cyan-400/10", dot: "bg-cyan-400 shadow-[0_0_6px_#00d4ff]" },
  idle: { label: "IDLE", color: "text-amber-400 border-amber-400/40 bg-amber-400/10", dot: "bg-amber-400" },
  offline: { label: "OFFLINE", color: "text-red-400 border-red-400/40 bg-red-400/10", dot: "bg-red-400" },
}

export function StatusBadge({ status }: { status: AgentStatus }) {
  const c = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-mono font-semibold ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === "active" ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  )
}

"use client"

import { useState } from "react"
import { useAgentStore } from "@/hooks/useAgentStore"
import { AgentCard } from "@/components/AgentCard"
import { AssignModal } from "@/components/AssignModal"
import { Agent, AgentStatus } from "@/lib/types"

const FILTERS: { label: string; value: AgentStatus | "all" }[] = [
  { label: "ALL", value: "all" },
  { label: "ACTIVE", value: "active" },
  { label: "AVAILABLE", value: "available" },
  { label: "IDLE", value: "idle" },
  { label: "OFFLINE", value: "offline" },
]

export default function AgentsPage() {
  const { agents, tasks, assignAgent } = useAgentStore()
  const [filter, setFilter] = useState<AgentStatus | "all">("all")
  const [assignTarget, setAssignTarget] = useState<Agent | null>(null)

  const filtered = filter === "all" ? agents : agents.filter((a) => a.status === filter)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-white tracking-wider">AGENT ROSTER</h1>
        <p className="text-slate-500 text-sm font-mono mt-0.5">{agents.length} agents deployed</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 rounded border font-mono text-xs font-semibold transition-all ${
              filter === value
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-400"
                : "border-[#1a1a2e] text-slate-500 hover:text-slate-300 hover:border-slate-600"
            }`}
          >
            {label} ({value === "all" ? agents.length : agents.filter((a) => a.status === value).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onAssign={setAssignTarget} />
        ))}
      </div>

      {assignTarget && (
        <AssignModal
          agent={assignTarget}
          tasks={tasks}
          onAssign={assignAgent}
          onClose={() => setAssignTarget(null)}
        />
      )}
    </div>
  )
}

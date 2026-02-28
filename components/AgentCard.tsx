"use client"

import { Agent } from "@/lib/types"
import { StatusBadge } from "./StatusBadge"
import { Bot, Cpu, Clock } from "lucide-react"

type Props = {
  agent: Agent
  onAssign?: (agent: Agent) => void
  compact?: boolean
}

export function AgentCard({ agent, onAssign, compact }: Props) {
  const glowClass =
    agent.status === "active"
      ? "border-green-400/30 shadow-[0_0_20px_rgba(0,255,136,0.05)]"
      : agent.status === "available"
      ? "border-cyan-400/30 shadow-[0_0_20px_rgba(0,212,255,0.05)]"
      : "border-[#1a1a2e]"

  return (
    <div className={`bg-[#0f0f1a] rounded-lg border p-4 transition-all ${glowClass}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            agent.status === "active" ? "bg-green-400/10" : agent.status === "available" ? "bg-cyan-400/10" : "bg-slate-800"
          }`}>
            <Bot className={`w-4 h-4 ${
              agent.status === "active" ? "text-green-400" : agent.status === "available" ? "text-cyan-400" : "text-slate-500"
            }`} />
          </div>
          <div>
            <div className="text-white font-mono font-bold text-sm">{agent.name}</div>
            <div className="text-slate-400 text-xs">{agent.role}</div>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {!compact && (
        <div className="mt-3 space-y-1.5">
          <div className="text-slate-600 font-mono text-xs">{agent.department}</div>
          {agent.currentTask && (
            <div className="flex items-start gap-1.5">
              <Cpu className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
              <span className="text-slate-300 text-xs leading-relaxed">{agent.currentTask}</span>
            </div>
          )}
          {agent.tokensUsed && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-600" />
              <span className="text-slate-500 font-mono text-xs">{agent.tokensUsed.toLocaleString()} tokens</span>
            </div>
          )}
        </div>
      )}

      {agent.status === "available" && onAssign && (
        <button
          onClick={() => onAssign(agent)}
          className="mt-3 w-full py-1.5 rounded border border-cyan-400/40 bg-cyan-400/5 text-cyan-400 font-mono text-xs font-semibold hover:bg-cyan-400/15 transition-colors"
        >
          + ASSIGN TASK
        </button>
      )}
    </div>
  )
}

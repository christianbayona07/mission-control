"use client"

import { useAgentStore } from "@/hooks/useAgentStore"
import { Agent, Department } from "@/lib/types"
import { Bot, Wifi, WifiOff, Zap, Clock } from "lucide-react"
import { useState } from "react"

const DEPT_LAYOUT: { dept: Department; color: string; accent: string; col: string; row: string }[] = [
  { dept: "Frontend Development", color: "border-cyan-400/30 bg-cyan-400/5", accent: "text-cyan-400", col: "col-start-1 col-end-3", row: "row-start-1 row-end-2" },
  { dept: "Backend Development", color: "border-purple-400/30 bg-purple-400/5", accent: "text-purple-400", col: "col-start-3 col-end-5", row: "row-start-1 row-end-2" },
  { dept: "UI/UX Design", color: "border-pink-400/30 bg-pink-400/5", accent: "text-pink-400", col: "col-start-5 col-end-7", row: "row-start-1 row-end-2" },
  { dept: "Research & Innovation", color: "border-yellow-400/30 bg-yellow-400/5", accent: "text-yellow-400", col: "col-start-1 col-end-3", row: "row-start-2 row-end-3" },
  { dept: "QA & Testing", color: "border-green-400/30 bg-green-400/5", accent: "text-green-400", col: "col-start-3 col-end-5", row: "row-start-2 row-end-3" },
  { dept: "DevOps & Infrastructure", color: "border-orange-400/30 bg-orange-400/5", accent: "text-orange-400", col: "col-start-5 col-end-7", row: "row-start-2 row-end-3" },
]

const statusGlow: Record<Agent["status"], string> = {
  active: "shadow-[0_0_16px_rgba(0,255,136,0.4)] border-green-400",
  available: "shadow-[0_0_12px_rgba(0,212,255,0.3)] border-cyan-400/60",
  idle: "border-amber-400/40",
  offline: "border-slate-700",
}

const statusDot: Record<Agent["status"], string> = {
  active: "bg-green-400 shadow-[0_0_6px_#00ff88] animate-pulse",
  available: "bg-cyan-400 shadow-[0_0_6px_#00d4ff]",
  idle: "bg-amber-400",
  offline: "bg-slate-600",
}

function AgentDesk({ agent, onClick }: { agent: Agent; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border bg-[#0a0a0f] transition-all hover:scale-105 cursor-pointer ${statusGlow[agent.status]}`}
    >
      {/* Status dot */}
      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${statusDot[agent.status]}`} />

      {/* Avatar */}
      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
        agent.status === "active" ? "border-green-400 bg-green-400/10" :
        agent.status === "available" ? "border-cyan-400/60 bg-cyan-400/10" :
        "border-slate-700 bg-slate-800"
      }`}>
        <Bot className={`w-6 h-6 ${
          agent.status === "active" ? "text-green-400" :
          agent.status === "available" ? "text-cyan-400" :
          agent.status === "idle" ? "text-amber-400" : "text-slate-600"
        }`} />
      </div>

      {/* Name */}
      <div className="text-center">
        <div className="text-white font-mono font-bold text-xs">{agent.name}</div>
        <div className="text-slate-500 text-xs leading-tight max-w-[80px] truncate">{agent.role.split(" ")[0]}</div>
      </div>

      {/* Current task tooltip on hover */}
      {agent.currentTask && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a1a2e] border border-[#2a2a3e] rounded px-2 py-1 text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 max-w-[200px] truncate">
          {agent.currentTask}
        </div>
      )}

      {/* Connection indicator */}
      <div className="flex items-center gap-1">
        {agent.status !== "offline" ? (
          <Wifi className="w-3 h-3 text-slate-600" />
        ) : (
          <WifiOff className="w-3 h-3 text-slate-700" />
        )}
        {agent.tokensUsed && (
          <span className="text-slate-600 font-mono text-xs">{(agent.tokensUsed / 1000).toFixed(0)}k</span>
        )}
      </div>
    </button>
  )
}

export default function OfficePage() {
  const { agents } = useAgentStore()
  const [selected, setSelected] = useState<Agent | null>(null)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-wider">OFFICE VIEW</h1>
          <p className="text-slate-500 text-sm font-mono mt-0.5">Virtual workspace — agent desks by department</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#00ff88]" />ACTIVE</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" />AVAILABLE</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />IDLE</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-600" />OFFLINE</span>
        </div>
      </div>

      {/* Office floor plan */}
      <div className="grid grid-cols-6 grid-rows-2 gap-4 min-h-[520px]">
        {DEPT_LAYOUT.map(({ dept, color, accent, col, row }) => {
          const deptAgents = agents.filter((a) => a.department === dept)
          return (
            <div key={dept} className={`${col} ${row} rounded-2xl border p-4 ${color} flex flex-col gap-3`}>
              {/* Dept label */}
              <div className={`font-mono text-xs font-bold tracking-wider ${accent} flex items-center gap-2`}>
                <span className={`w-1.5 h-1.5 rounded-full ${accent.replace("text-", "bg-")}`} />
                {dept.toUpperCase()}
              </div>

              {/* Desks */}
              <div className="flex flex-wrap gap-3 flex-1 content-start">
                {deptAgents.map((agent) => (
                  <AgentDesk key={agent.id} agent={agent} onClick={() => setSelected(agent)} />
                ))}
                {deptAgents.length === 0 && (
                  <div className="text-slate-700 text-xs font-mono self-center mx-auto">NO AGENTS</div>
                )}
              </div>

              {/* Floor stats */}
              <div className="flex items-center gap-3 text-xs font-mono border-t border-white/5 pt-2">
                <span className="text-green-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" />{deptAgents.filter(a => a.status === "active").length} active
                </span>
                <span className="text-cyan-400">{deptAgents.filter(a => a.status === "available").length} available</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Agent detail panel */}
      {selected && (
        <div className="fixed bottom-6 right-6 w-72 bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.6)] z-50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                selected.status === "active" ? "border-green-400 bg-green-400/10" : "border-cyan-400/60 bg-cyan-400/10"
              }`}>
                <Bot className={`w-5 h-5 ${selected.status === "active" ? "text-green-400" : "text-cyan-400"}`} />
              </div>
              <div>
                <div className="text-white font-mono font-bold">{selected.name}</div>
                <div className="text-slate-400 text-xs">{selected.role}</div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-600 hover:text-white text-xs">✕</button>
          </div>
          {selected.currentTask && (
            <div className="bg-[#0a0a0f] rounded-lg p-3 mb-3">
              <div className="text-slate-500 font-mono text-xs mb-1">CURRENT TASK</div>
              <div className="text-white text-sm">{selected.currentTask}</div>
              {selected.currentProject && (
                <div className="text-cyan-400 text-xs font-mono mt-1">{selected.currentProject}</div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3 h-3" /> {selected.tokensUsed?.toLocaleString()} tokens
            </span>
            <span className={`font-bold ${selected.status === "active" ? "text-green-400" : selected.status === "available" ? "text-cyan-400" : "text-amber-400"}`}>
              {selected.status.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

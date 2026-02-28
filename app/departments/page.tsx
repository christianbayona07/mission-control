"use client"

import { useAgentStore } from "@/hooks/useAgentStore"
import { DepartmentCard } from "@/components/DepartmentCard"
import { AgentCard } from "@/components/AgentCard"
import { AssignModal } from "@/components/AssignModal"
import { useState } from "react"
import { Agent, Department } from "@/lib/types"

const DEPARTMENTS: Department[] = [
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Research & Innovation",
  "QA & Testing",
  "DevOps & Infrastructure",
]

export default function DepartmentsPage() {
  const { agents, tasks, assignAgent } = useAgentStore()
  const [selected, setSelected] = useState<Department | null>(null)
  const [assignTarget, setAssignTarget] = useState<Agent | null>(null)

  const deptAgents = selected ? agents.filter((a) => a.department === selected) : []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-white tracking-wider">DEPARTMENTS</h1>
        <p className="text-slate-500 text-sm font-mono mt-0.5">Click a department to view its agents</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {DEPARTMENTS.map((dept) => (
          <button key={dept} onClick={() => setSelected(selected === dept ? null : dept)} className="text-left">
            <div className={`transition-all ${selected === dept ? "ring-2 ring-cyan-400/40 rounded-lg" : ""}`}>
              <DepartmentCard department={dept} agents={agents.filter((a) => a.department === dept)} />
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-3">
          <div className="text-cyan-400 font-mono text-sm font-bold tracking-wider border-b border-[#1a1a2e] pb-2">
            {selected.toUpperCase()} — {deptAgents.length} AGENT{deptAgents.length !== 1 ? "S" : ""}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {deptAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onAssign={setAssignTarget} />
            ))}
          </div>
        </div>
      )}

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

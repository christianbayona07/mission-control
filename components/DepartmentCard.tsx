import { Agent, Department } from "@/lib/types"
import { Code2, Server, Palette, FlaskConical, TestTube, Container } from "lucide-react"

const deptConfig: Record<Department, { icon: React.ElementType; color: string }> = {
  "Frontend Development": { icon: Code2, color: "text-cyan-400" },
  "Backend Development": { icon: Server, color: "text-purple-400" },
  "UI/UX Design": { icon: Palette, color: "text-pink-400" },
  "Research & Innovation": { icon: FlaskConical, color: "text-yellow-400" },
  "QA & Testing": { icon: TestTube, color: "text-green-400" },
  "DevOps & Infrastructure": { icon: Container, color: "text-orange-400" },
}

type Props = {
  department: Department
  agents: Agent[]
}

export function DepartmentCard({ department, agents }: Props) {
  const cfg = deptConfig[department]
  const Icon = cfg.icon
  const active = agents.filter((a) => a.status === "active").length
  const available = agents.filter((a) => a.status === "available").length

  return (
    <div className="bg-[#0f0f1a] rounded-lg border border-[#1a1a2e] p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${cfg.color}`} />
        </div>
        <div>
          <div className="text-white text-sm font-semibold">{department}</div>
          <div className="text-slate-500 font-mono text-xs">{agents.length} agent{agents.length !== 1 ? "s" : ""}</div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 bg-[#0a0a0f] rounded p-2 text-center">
          <div className="text-green-400 font-mono font-bold text-lg">{active}</div>
          <div className="text-slate-600 text-xs">ACTIVE</div>
        </div>
        <div className="flex-1 bg-[#0a0a0f] rounded p-2 text-center">
          <div className="text-cyan-400 font-mono font-bold text-lg">{available}</div>
          <div className="text-slate-600 text-xs">AVAILABLE</div>
        </div>
        <div className="flex-1 bg-[#0a0a0f] rounded p-2 text-center">
          <div className="text-slate-400 font-mono font-bold text-lg">{agents.length - active - available}</div>
          <div className="text-slate-600 text-xs">IDLE</div>
        </div>
      </div>
    </div>
  )
}

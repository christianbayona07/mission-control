import { Agent, Task, Project } from "@/lib/types"
import { Bot, Zap, CheckCircle2, FolderKanban, Activity } from "lucide-react"

type Props = { agents: Agent[]; tasks: Task[]; projects: Project[] }

export function StatsBar({ agents, tasks, projects }: Props) {
  const stats = [
    { label: "TOTAL AGENTS", value: agents.length, icon: Bot, color: "text-slate-300" },
    { label: "ACTIVE", value: agents.filter((a) => a.status === "active").length, icon: Zap, color: "text-green-400" },
    { label: "AVAILABLE", value: agents.filter((a) => a.status === "available").length, icon: Activity, color: "text-cyan-400" },
    { label: "PROJECTS", value: projects.filter((p) => p.status === "active").length, icon: FolderKanban, color: "text-purple-400" },
    { label: "TASKS DONE", value: tasks.filter((t) => t.status === "done").length, icon: CheckCircle2, color: "text-green-400" },
  ]

  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-lg p-4 flex items-center gap-3">
          <Icon className={`w-5 h-5 ${color} shrink-0`} />
          <div>
            <div className={`font-mono font-bold text-2xl ${color}`}>{value}</div>
            <div className="text-slate-600 text-xs font-mono">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

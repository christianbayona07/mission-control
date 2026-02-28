import { Task } from "@/lib/types"
import { AlertTriangle, CheckCircle2, Circle, Clock, GitPullRequest } from "lucide-react"

const priorityConfig = {
  critical: { color: "text-red-400 border-red-400/40 bg-red-400/10", label: "CRITICAL" },
  high: { color: "text-orange-400 border-orange-400/40 bg-orange-400/10", label: "HIGH" },
  medium: { color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10", label: "MEDIUM" },
  low: { color: "text-slate-400 border-slate-400/40 bg-slate-400/10", label: "LOW" },
}

const statusIcon = {
  todo: <Circle className="w-4 h-4 text-slate-500" />,
  in_progress: <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />,
  review: <GitPullRequest className="w-4 h-4 text-amber-400" />,
  done: <CheckCircle2 className="w-4 h-4 text-green-400" />,
}

type Props = {
  task: Task
  agentName?: string
  onComplete?: (taskId: string) => void
}

export function TaskCard({ task, agentName, onComplete }: Props) {
  const p = priorityConfig[task.priority]

  return (
    <div className={`bg-[#0f0f1a] rounded-lg border p-3 transition-all ${(task as any).running ? "border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.1)]" : task.isMvp ? "border-orange-400/20" : "border-[#1a1a2e]"}`}>
            {(task as any).running && (
        <div className="flex items-center gap-2 mb-2 px-2 py-1 rounded bg-purple-400/10 border border-purple-400/30">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span className="text-purple-400 font-mono text-xs font-bold animate-pulse">AGENT RUNNING</span>
          <span className="ml-auto text-purple-300 font-mono text-xs">{task.progress}%</span>
        </div>
      )}
      {task.progress > 0 && task.status !== "done" && (
        <div className="w-full bg-[#0a0a0f] rounded-full h-1 mb-2">
          <div className="h-1 rounded-full bg-gradient-to-r from-cyan-500 to-green-400 transition-all duration-1000" style={{ width: `${task.progress}%` }} />
        </div>
      )}
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{statusIcon[task.status]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white text-sm font-medium truncate">{task.title}</span>
            {task.isMvp && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-orange-400/40 bg-orange-400/10 text-orange-400 font-mono text-xs">
                <AlertTriangle className="w-2.5 h-2.5" /> MVP
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`px-1.5 py-0.5 rounded border text-xs font-mono ${p.color}`}>{p.label}</span>
            <span className="text-slate-500 text-xs">{task.department}</span>
            {agentName && <span className="text-cyan-400 text-xs font-mono">→ {agentName}</span>}
          </div>
        </div>
        {task.status !== "done" && onComplete && (
          <button
            onClick={() => onComplete(task.id)}
            className="shrink-0 text-slate-600 hover:text-green-400 transition-colors"
            title="Mark complete"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

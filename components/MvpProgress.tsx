import { Task } from "@/lib/types"
import { AlertTriangle } from "lucide-react"

export function MvpProgress({ tasks }: { tasks: Task[] }) {
  const mvp = tasks.filter((t) => t.isMvp)
  const done = mvp.filter((t) => t.status === "done").length
  const pct = mvp.length > 0 ? Math.round((done / mvp.length) * 100) : 0

  return (
    <div className="bg-[#0f0f1a] border border-orange-400/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 font-mono text-sm font-bold">MVP PROGRESS</span>
        </div>
        <span className="text-white font-mono font-bold">{pct}%</span>
      </div>
      <div className="w-full bg-[#0a0a0f] rounded-full h-2 mb-2">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-green-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-slate-500 font-mono text-xs">{done}/{mvp.length} MVP tasks completed</div>
    </div>
  )
}

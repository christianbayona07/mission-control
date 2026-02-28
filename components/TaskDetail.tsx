"use client"

import { useState } from "react"
import { Task, Agent } from "@/lib/types"
import { X, MessageSquare, AlertTriangle, Info, CheckCircle2, ChevronUp, ChevronDown } from "lucide-react"
import { StatusBadge } from "./StatusBadge"

const commentTypeConfig = {
  note: { icon: Info, color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20", label: "NOTE" },
  update: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", label: "UPDATE" },
  blocker: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", label: "BLOCKER" },
}

const priorityColor = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-slate-400",
}

type Props = {
  task: Task
  agent?: Agent
  onClose: () => void
  onAddComment: (taskId: string, comment: { author: string; content: string; type: "note" | "update" | "blocker" }) => void
  onUpdateProgress: (taskId: string, progress: number) => void
  onComplete: (taskId: string) => void
  onRunAgent?: (taskId: string) => void
}

export function TaskDetail({ task, agent, onClose, onAddComment, onUpdateProgress, onComplete, onRunAgent }: Props) {
  const [commentText, setCommentText] = useState("")
  const [commentType, setCommentType] = useState<"note" | "update" | "blocker">("note")
  const [progress, setProgress] = useState(task.progress)

  const handleAddComment = () => {
    if (!commentText.trim()) return
    onAddComment(task.id, { author: "Chris", content: commentText, type: commentType })
    setCommentText("")
  }

  const handleProgressChange = (val: number) => {
    setProgress(val)
    onUpdateProgress(task.id, val)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-stretch justify-end z-50">
      <div className="w-full max-w-lg bg-[#0a0a0f] border-l border-[#1a1a2e] flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1a1a2e] shrink-0">
          <div className="flex items-center gap-2">
            {task.isMvp && <AlertTriangle className="w-4 h-4 text-orange-400" />}
            <span className="text-cyan-400 font-mono text-xs font-bold tracking-wider">TASK DETAIL</span>
            <span className="text-slate-600 font-mono text-xs">{task.id}</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Task info */}
          <div className="p-5 border-b border-[#1a1a2e] space-y-3">
            <h2 className="text-white font-semibold text-lg leading-snug">{task.title}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{task.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className={`font-mono text-xs font-bold ${priorityColor[task.priority]}`}>
                {task.priority.toUpperCase()}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 text-xs">{task.department}</span>
              {task.isMvp && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="text-orange-400 text-xs font-mono font-bold">MVP</span>
                </>
              )}
            </div>
            {agent && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-500 text-xs">Assigned to</span>
                <span className="text-white text-xs font-mono font-bold">{agent.name}</span>
                <StatusBadge status={agent.status} />
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="p-5 border-b border-[#1a1a2e] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono text-xs">PROGRESS</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleProgressChange(Math.max(0, progress - 10))} className="text-slate-500 hover:text-white">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <span className="text-white font-mono font-bold w-10 text-center">{progress}%</span>
                <button onClick={() => handleProgressChange(Math.min(100, progress + 10))} className="text-slate-500 hover:text-white">
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="w-full bg-[#1a1a2e] rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-green-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            {task.status !== "done" && task.assignedAgentId && onRunAgent && (
              <button
                onClick={() => onRunAgent(task.id)}
                className="w-full py-2 rounded border border-purple-400/40 bg-purple-400/10 text-purple-400 font-mono text-xs font-semibold hover:bg-purple-400/20 transition-colors mb-2"
              >
                ▶ RUN AGENT
              </button>
            )}
            {task.status !== "done" && (
              <button
                onClick={() => onComplete(task.id)}
                className="w-full py-2 rounded border border-green-400/40 bg-green-400/10 text-green-400 font-mono text-xs font-semibold hover:bg-green-400/20 transition-colors"
              >
                ✓ MARK COMPLETE
              </button>
            )}
          </div>

          {/* Comments */}
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
              <MessageSquare className="w-3.5 h-3.5" />
              ACTIVITY ({task.comments.length})
            </div>

            {task.comments.length === 0 && (
              <div className="text-slate-600 text-sm text-center py-4">No activity yet</div>
            )}

            {task.comments.map((comment) => {
              const cfg = commentTypeConfig[comment.type]
              const Icon = cfg.icon
              return (
                <div key={comment.id} className={`rounded-lg border p-3 ${cfg.bg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                      <span className={`font-mono text-xs font-bold ${cfg.color}`}>{comment.author}</span>
                      <span className={`font-mono text-xs ${cfg.color} opacity-60`}>{cfg.label}</span>
                    </div>
                    <span className="text-slate-600 font-mono text-xs">
                      {new Date(comment.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{comment.content}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Add comment */}
        <div className="p-4 border-t border-[#1a1a2e] shrink-0 space-y-3">
          <div className="flex gap-2">
            {(["note", "update", "blocker"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setCommentType(type)}
                className={`px-2.5 py-1 rounded border font-mono text-xs font-semibold transition-all ${
                  commentType === type
                    ? commentTypeConfig[type].bg + " " + commentTypeConfig[type].color
                    : "border-[#1a1a2e] text-slate-500 hover:text-slate-300"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a note, update, or blocker..."
              rows={2}
              className="flex-1 bg-[#0f0f1a] border border-[#1a1a2e] rounded px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/40 resize-none"
              onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleAddComment() }}
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="px-3 rounded border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 text-xs font-mono font-semibold hover:bg-cyan-400/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              POST
            </button>
          </div>
          <div className="text-slate-600 font-mono text-xs">⌘ + Enter to post</div>
        </div>
      </div>
    </div>
  )
}

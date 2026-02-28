"use client"

import { useState } from "react"
import { Agent, Task } from "@/lib/types"
import { X, Bot } from "lucide-react"
import { StatusBadge } from "./StatusBadge"

type Props = {
  agent: Agent
  tasks: Task[]
  onAssign: (agentId: string, taskId: string) => void
  onClose: () => void
}

export function AssignModal({ agent, tasks, onAssign, onClose }: Props) {
  const openTasks = tasks.filter((t) => t.status === "todo" && !t.assignedAgentId)
  const [selectedTask, setSelectedTask] = useState<string>("")

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl w-full max-w-md shadow-[0_0_60px_rgba(0,212,255,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1a1a2e]">
          <div className="text-cyan-400 font-mono font-bold text-sm tracking-wider">ASSIGN TASK</div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Agent info */}
        <div className="p-5 border-b border-[#1a1a2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-mono font-bold">{agent.name}</div>
              <div className="text-slate-400 text-xs">{agent.role}</div>
            </div>
            <div className="ml-auto">
              <StatusBadge status={agent.status} />
            </div>
          </div>
        </div>

        {/* Task selector */}
        <div className="p-5 space-y-3">
          <div className="text-slate-400 text-xs font-mono mb-2">SELECT TASK</div>
          {openTasks.length === 0 ? (
            <div className="text-slate-500 text-sm text-center py-4">No unassigned tasks available</div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {openTasks.map((task) => (
                <label
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTask === task.id
                      ? "border-cyan-400/40 bg-cyan-400/5"
                      : "border-[#1a1a2e] hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="task"
                    value={task.id}
                    checked={selectedTask === task.id}
                    onChange={() => setSelectedTask(task.id)}
                    className="mt-0.5 accent-cyan-400"
                  />
                  <div>
                    <div className="text-white text-sm">{task.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{task.department} · {task.priority}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-5 border-t border-[#1a1a2e]">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded border border-slate-700 text-slate-400 text-sm hover:border-slate-500 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedTask) {
                onAssign(agent.id, selectedTask)
                onClose()
              }
            }}
            disabled={!selectedTask}
            className="flex-1 py-2 rounded border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 text-sm font-semibold hover:bg-cyan-400/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Assign →
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Task, Department, TaskPriority } from "@/lib/types"
import { X, Plus } from "lucide-react"

const DEPARTMENTS: Department[] = [
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Research & Innovation",
  "QA & Testing",
  "DevOps & Infrastructure",
]

type Props = {
  projects: { id: string; name: string }[]
  onAdd: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "comments" | "progress">) => void
  onClose: () => void
}

export function AddTaskModal({ projects, onAdd, onClose }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: DEPARTMENTS[0] as Department,
    priority: "medium" as TaskPriority,
    projectId: projects[0]?.id ?? "",
    isMvp: false,
    status: "todo" as Task["status"],
  })

  const valid = form.title.trim() && form.projectId

  const handleSubmit = () => {
    if (!valid) return
    onAdd({ ...form, assignedAgentId: undefined })
    onClose()
  }

  const field = "bg-[#0f0f1a] border border-[#1a1a2e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/40 w-full"

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl w-full max-w-lg shadow-[0_0_60px_rgba(0,212,255,0.1)]">
        <div className="flex items-center justify-between p-5 border-b border-[#1a1a2e]">
          <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm tracking-wider">
            <Plus className="w-4 h-4" /> NEW TASK
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-slate-400 font-mono text-xs mb-1.5 block">TITLE *</label>
            <input
              className={field}
              placeholder="Task title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-slate-400 font-mono text-xs mb-1.5 block">DESCRIPTION</label>
            <textarea
              className={field + " resize-none"}
              rows={3}
              placeholder="What needs to be done..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-mono text-xs mb-1.5 block">PROJECT *</label>
              <select className={field} value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 font-mono text-xs mb-1.5 block">PRIORITY</label>
              <select className={field} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}>
                {["critical", "high", "medium", "low"].map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-mono text-xs mb-1.5 block">DEPARTMENT</label>
            <select className={field} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value as Department })}>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, isMvp: !form.isMvp })}
              className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                form.isMvp ? "border-orange-400 bg-orange-400/20" : "border-[#1a1a2e]"
              }`}
            >
              {form.isMvp && <span className="text-orange-400 text-xs">✓</span>}
            </div>
            <span className="text-slate-300 text-sm">Mark as MVP task</span>
            <span className="text-orange-400 font-mono text-xs ml-1">⚠ critical path</span>
          </label>
        </div>

        <div className="flex gap-3 p-5 border-t border-[#1a1a2e]">
          <button onClick={onClose} className="flex-1 py-2 rounded border border-slate-700 text-slate-400 text-sm hover:border-slate-500 hover:text-slate-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!valid}
            className="flex-1 py-2 rounded border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 text-sm font-semibold hover:bg-cyan-400/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Task →
          </button>
        </div>
      </div>
    </div>
  )
}

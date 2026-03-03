"use client"

import { useState } from "react"
import { useAgentStore } from "@/hooks/useAgentStore"
import { TaskCard } from "@/components/TaskCard"
import { TaskDetail } from "@/components/TaskDetail"
import { AddTaskModal } from "@/components/AddTaskModal"
import { MvpProgress } from "@/components/MvpProgress"
import { Task } from "@/lib/types"
import { AlertTriangle, Plus, Github, Lightbulb, Layers, CheckSquare, ExternalLink } from "lucide-react"
import Link from "next/link"

const STATUS_OPTIONS = ["planning", "active", "paused", "completed"] as const

const statusColor: Record<string, string> = {
  planning:  "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  active:    "text-green-400 border-green-400/40 bg-green-400/10",
  paused:    "text-amber-400 border-amber-400/40 bg-amber-400/10",
  completed: "text-slate-400 border-slate-400/40 bg-slate-400/10",
}

const statusInactive = "text-slate-600 border-slate-700 hover:border-slate-500 hover:text-slate-400"

export default function ProjectsPage() {
  const { projects, tasks, agents, completeTask, addTask, addComment, updateProgress } = useAgentStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [projectStatuses, setProjectStatuses] = useState<Record<string, string>>({})

  const getStatus = (project: typeof projects[0]) =>
    projectStatuses[project.id] ?? project.status

  const changeStatus = async (projectId: string, status: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setProjectStatuses(prev => ({ ...prev, [projectId]: status }))
    await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-wider">PROJECTS</h1>
          <p className="text-slate-500 text-sm font-mono mt-0.5">{projects.length} projects tracked</p>
        </div>
        <button onClick={() => setShowAddTask(true)} className="flex items-center gap-2 px-3 py-2 rounded border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 font-mono text-xs font-semibold hover:bg-cyan-400/20 transition-colors">
          <Plus className="w-3.5 h-3.5" /> NEW TASK
        </button>
      </div>

      {projects.map((project) => {
        const projectTasks = tasks.filter((t) => t.projectId === project.id)
        const mvpTasks = projectTasks.filter((t) => t.isMvp)
        const niceTasks = projectTasks.filter((t) => !t.isMvp)
        const done = projectTasks.filter((t) => t.status === "done").length
        const isExpanded = expanded[project.id] !== false
        const currentStatus = getStatus(project)

        return (
          <div key={project.id} className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl overflow-hidden">
            <div className="p-6 cursor-pointer hover:bg-[#111120] transition-colors"
              onClick={() => setExpanded(e => ({ ...e, [project.id]: !isExpanded }))}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link href={`/projects/${project.id}`} onClick={e => e.stopPropagation()}
                      className="text-white font-bold font-mono text-lg hover:text-cyan-400 transition-colors">
                      {project.name}
                    </Link>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-slate-500 hover:text-white transition-colors text-xs">
                        <Github className="w-3.5 h-3.5" /><ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                    {STATUS_OPTIONS.map(s => (
                      <button key={s} onClick={e => changeStatus(project.id, s, e)}
                        className={`px-2 py-0.5 rounded border font-mono text-xs font-bold transition-all ${currentStatus === s ? statusColor[s] : statusInactive}`}>
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm">{project.description}</p>
                </div>
                <div className="text-slate-500 font-mono text-xs shrink-0 pt-1">{done}/{projectTasks.length} tasks</div>
              </div>
            </div>

            {isExpanded && (
              <div className="px-6 pb-6 space-y-6 border-t border-[#1a1a2e] pt-5">
                {project.vision && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs font-bold">
                      <Lightbulb className="w-3.5 h-3.5" /> PRODUCT VISION
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed bg-[#0a0a0f] rounded-lg px-4 py-3 border border-[#1a1a2e]">{project.vision}</p>
                  </div>
                )}
                {project.features && project.features.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                      <CheckSquare className="w-3.5 h-3.5" /> CORE FEATURES — MVP
                    </div>
                    <div className="bg-[#0a0a0f] rounded-lg px-4 py-3 border border-[#1a1a2e] space-y-2">
                      {project.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-cyan-400 mt-0.5 shrink-0">→</span>{f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
                      <Layers className="w-3.5 h-3.5" /> TECH STACK
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((t, i) => (
                        <span key={i} className="px-2 py-1 rounded border border-purple-400/20 bg-purple-400/10 text-purple-300 text-xs font-mono">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                <MvpProgress tasks={projectTasks} />
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold mb-3">
                      <AlertTriangle className="w-3.5 h-3.5" /> MVP TASKS ({mvpTasks.length})
                    </div>
                    {mvpTasks.map((task) => (
                      <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                        <TaskCard task={task} agentName={agents.find((a) => a.id === task.assignedAgentId)?.name} onComplete={completeTask} />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="text-slate-500 font-mono text-xs font-bold mb-3">NICE-TO-HAVE ({niceTasks.length})</div>
                    {niceTasks.length === 0 && <div className="text-slate-700 text-xs">None yet</div>}
                    {niceTasks.map((task) => (
                      <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                        <TaskCard task={task} agentName={agents.find((a) => a.id === task.assignedAgentId)?.name} onComplete={completeTask} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {selectedTask && (
        <TaskDetail task={selectedTask} agent={agents.find((a) => a.id === selectedTask.assignedAgentId)}
          onClose={() => setSelectedTask(null)} onAddComment={addComment} onUpdateProgress={updateProgress}
          onComplete={(id) => { completeTask(id); setSelectedTask(null) }} />
      )}
      {showAddTask && (
        <AddTaskModal projects={projects} onAdd={addTask} onClose={() => setShowAddTask(false)} />
      )}
    </div>
  )
}

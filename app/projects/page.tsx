"use client"

import { useState } from "react"
import { useAgentStore } from "@/hooks/useAgentStore"
import { TaskCard } from "@/components/TaskCard"
import { TaskDetail } from "@/components/TaskDetail"
import { AddTaskModal } from "@/components/AddTaskModal"
import { MvpProgress } from "@/components/MvpProgress"
import { Task } from "@/lib/types"
import { AlertTriangle, Plus, CheckCircle2 } from "lucide-react"

const statusColor = {
  planning: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  active: "text-green-400 border-green-400/40 bg-green-400/10",
  paused: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  completed: "text-slate-400 border-slate-400/40 bg-slate-400/10",
}

export default function ProjectsPage() {
  const { projects, tasks, agents, completeTask, addTask, addComment, updateProgress } = useAgentStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)

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
        const done = projectTasks.filter((t) => t.status === "done").length

        return (
          <div key={project.id} className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-6 space-y-5">
            {/* Project header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-white font-bold font-mono text-lg">{project.name}</h2>
                <p className="text-slate-400 text-sm mt-1">{project.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded border font-mono text-xs font-bold ${statusColor[project.status]}`}>
                  {project.status.toUpperCase()}
                </span>
                <span className="text-slate-500 font-mono text-xs">{done}/{projectTasks.length} tasks</span>
              </div>
            </div>

            {/* MVP Progress */}
            <MvpProgress tasks={projectTasks} />

            {/* Tasks split: MVP vs Nice-to-have */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold mb-3">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  MVP TASKS ({mvpTasks.length})
                </div>
                {mvpTasks.map((task) => (
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                    <TaskCard task={task} agentName={agents.find((a) => a.id === task.assignedAgentId)?.name} onComplete={completeTask} />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="text-slate-500 font-mono text-xs font-bold mb-3">
                  NICE-TO-HAVE ({projectTasks.filter((t) => !t.isMvp).length})
                </div>
                {projectTasks.filter((t) => !t.isMvp).map((task) => (
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                    <TaskCard task={task} agentName={agents.find((a) => a.id === task.assignedAgentId)?.name} onComplete={completeTask} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          agent={agents.find((a) => a.id === selectedTask.assignedAgentId)}
          onClose={() => setSelectedTask(null)}
          onAddComment={addComment}
          onUpdateProgress={updateProgress}
          onComplete={(id) => { completeTask(id); setSelectedTask(null) }}
        />
      )}
      {showAddTask && (
        <AddTaskModal projects={projects} onAdd={addTask} onClose={() => setShowAddTask(false)} />
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useAgentStore } from "@/hooks/useAgentStore"
import { StatsBar } from "@/components/StatsBar"
import { AgentCard } from "@/components/AgentCard"
import { TaskCard } from "@/components/TaskCard"
import { DepartmentCard } from "@/components/DepartmentCard"
import { AssignModal } from "@/components/AssignModal"
import { AddTaskModal } from "@/components/AddTaskModal"
import { TaskDetail } from "@/components/TaskDetail"
import { LiveClock } from "@/components/LiveClock"
import { MvpProgress } from "@/components/MvpProgress"
import { Agent, Task, Department } from "@/lib/types"
import { Plus } from "lucide-react"
import GitHubPanel from "@/components/GitHubPanel"
import GatewayPanel from "@/components/GatewayPanel"

const DEPARTMENTS: Department[] = [
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Research & Innovation",
  "QA & Testing",
  "DevOps & Infrastructure",
]

export default function Dashboard() {
  const { agents, tasks, projects, lastUpdated, assignAgent, completeTask, addTask, addComment, updateProgress } = useAgentStore()
  const [assignTarget, setAssignTarget] = useState<Agent | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set())


  const handleRunAgent = async (taskId: string) => {
    setRunningAgents(prev => new Set(prev).add(taskId))
    await fetch("/api/run-agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId }) })
    setTimeout(() => setRunningAgents(prev => { const s = new Set(prev); s.delete(taskId); return s }), 5000)
  }

  const activeTasks = tasks.filter((t) => t.status === "in_progress" || t.status === "review")
  const pendingTasks = tasks.filter((t) => t.status === "todo")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-wider">MISSION CONTROL</h1>
          <p className="text-slate-500 text-sm font-mono mt-0.5">AI AGENT OPERATIONS · REAL-TIME</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-slate-600 font-mono text-xs">
              synced {lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 px-3 py-2 rounded border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 font-mono text-xs font-semibold hover:bg-cyan-400/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> NEW TASK
          </button>
          <LiveClock />
        </div>
      </div>

      {/* Stats */}
      <StatsBar agents={agents} tasks={tasks} projects={projects} />

      {/* MVP Progress */}
      <MvpProgress tasks={tasks} />

      {/* Main 3-column grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Departments */}
        <div className="space-y-3">
          <div className="text-slate-400 font-mono text-xs tracking-wider border-b border-[#1a1a2e] pb-2">DEPARTMENTS</div>
          {DEPARTMENTS.map((dept) => (
            <DepartmentCard
              key={dept}
              department={dept}
              agents={agents.filter((a) => a.department === dept)}
            />
          ))}
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#1a1a2e] pb-2">
            <div className="text-slate-400 font-mono text-xs tracking-wider">
              ACTIVE <span className="text-cyan-400 ml-1">({activeTasks.length})</span>
            </div>
            <button onClick={() => setShowAddTask(true)} className="text-slate-600 hover:text-cyan-400 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          {activeTasks.length === 0 && (
            <div className="text-slate-600 text-sm text-center py-4">No active tasks</div>
          )}
          {activeTasks.map((task) => (
            <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
              <TaskCard
                task={task}
                agentName={agents.find((a) => a.id === task.assignedAgentId)?.name}
                onComplete={completeTask}
              />
            </div>
          ))}

          <div className="flex items-center justify-between border-b border-[#1a1a2e] pb-2 mt-4">
            <div className="text-slate-400 font-mono text-xs tracking-wider">PENDING ({pendingTasks.length})</div>
          </div>
          {pendingTasks.map((task) => (
            <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
              <TaskCard task={task} />
            </div>
          ))}
        </div>

        {/* Agent Roster */}
        <div className="space-y-3">
          <div className="text-slate-400 font-mono text-xs tracking-wider border-b border-[#1a1a2e] pb-2">AGENT ROSTER</div>
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onAssign={setAssignTarget} />
          ))}
        </div>
      </div>

      {/* GitHub Panel */}
      <div className="grid grid-cols-2 gap-6">
        <GitHubPanel />
        <GatewayPanel />
      </div>

      {/* Modals */}
      {assignTarget && (
        <AssignModal agent={assignTarget} tasks={tasks} onAssign={assignAgent} onClose={() => setAssignTarget(null)} />
      )}
      {showAddTask && (
        <AddTaskModal projects={projects} onAdd={addTask} onClose={() => setShowAddTask(false)} />
      )}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          agent={agents.find((a) => a.id === selectedTask.assignedAgentId)}
          onClose={() => setSelectedTask(null)}
          onAddComment={addComment}
          onUpdateProgress={updateProgress}
          onComplete={(id) => { completeTask(id); setSelectedTask(null) }}
          onRunAgent={handleRunAgent}
        />
      )}
    </div>
  )
}

"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { Agent, Task, Project, Comment } from "@/lib/types"
import { mockAgents, mockTasks, mockProjects } from "@/lib/mock-data"

const API = "/api"
const POLL_INTERVAL = 30000

type AgentStore = {
  agents: Agent[]
  tasks: Task[]
  projects: Project[]
  lastUpdated: Date | null
  loading: boolean
  assignAgent: (agentId: string, taskId: string) => void
  updateAgentStatus: (agentId: string, status: Agent["status"]) => void
  completeTask: (taskId: string) => void
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "comments" | "progress">) => void
  addComment: (taskId: string, comment: Omit<Comment, "id" | "createdAt">) => void
  updateProgress: (taskId: string, progress: number) => void
}

const AgentStoreContext = createContext<AgentStore | null>(null)

async function fetchState() {
  try {
    const res = await fetch(`${API}/state`, { cache: "no-store" })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export function AgentStoreProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [projects] = useState<Project[]>(mockProjects)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  const loadState = useCallback(async () => {
    const state = await fetchState()
    if (state) {
      setAgents(state.agents)
      setTasks(state.tasks)
      setLastUpdated(new Date(state.updatedAt))
    }
    setLoading(false)
  }, [])

  // Initial load + polling every 30s
  useEffect(() => {
    loadState()
    const interval = setInterval(loadState, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [loadState])

  const assignAgent = useCallback(async (agentId: string, taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    const project = projects.find((p) => p.id === task?.projectId)

    // Optimistic update
    setAgents((prev) => prev.map((a) => a.id === agentId ? { ...a, status: "active", currentTask: task?.title, currentProject: project?.name } : a))
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, assignedAgentId: agentId, status: "in_progress" } : t))

    // Persist
    await fetch(`${API}/agents`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: agentId, status: "active", currentTask: task?.title, currentProject: project?.name }) })
    await fetch(`${API}/tasks`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: taskId, assignedAgentId: agentId, status: "in_progress" }) })
  }, [tasks, projects])

  const updateAgentStatus = useCallback(async (agentId: string, status: Agent["status"]) => {
    setAgents((prev) => prev.map((a) => a.id === agentId ? { ...a, status } : a))
    await fetch(`${API}/agents`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: agentId, status }) })
  }, [])

  const completeTask = useCallback(async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: "done", progress: 100 } : t))
    if (task?.assignedAgentId) {
      setAgents((prev) => prev.map((a) => a.id === task.assignedAgentId ? { ...a, status: "available", currentTask: undefined, currentProject: undefined } : a))
      await fetch(`${API}/agents`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: task.assignedAgentId, status: "available", currentTask: null, currentProject: null }) })
    }
    await fetch(`${API}/tasks`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: taskId, status: "done", progress: 100 }) })
  }, [tasks])

  const addTask = useCallback(async (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "comments" | "progress">) => {
    const res = await fetch(`${API}/tasks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(task) })
    const newTask = await res.json()
    setTasks((prev) => [...prev, newTask])
  }, [])

  const addComment = useCallback(async (taskId: string, comment: Omit<Comment, "id" | "createdAt">) => {
    const newComment: Comment = { ...comment, id: `c-${Date.now()}`, createdAt: new Date().toISOString() }
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t))
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      await fetch(`${API}/tasks`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: taskId, comments: [...task.comments, newComment] }) })
    }
  }, [tasks])

  const updateProgress = useCallback(async (taskId: string, progress: number) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, progress } : t))
    await fetch(`${API}/tasks`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: taskId, progress }) })
  }, [])

  return (
    <AgentStoreContext.Provider value={{ agents, tasks, projects, lastUpdated, loading, assignAgent, updateAgentStatus, completeTask, addTask, addComment, updateProgress }}>
      {children}
    </AgentStoreContext.Provider>
  )
}

export function useAgentStore() {
  const ctx = useContext(AgentStoreContext)
  if (!ctx) throw new Error("useAgentStore must be used within AgentStoreProvider")
  return ctx
}

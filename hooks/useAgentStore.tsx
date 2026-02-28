"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { Agent, Task, Project, Comment } from "@/lib/types"
import { mockAgents, mockTasks, mockProjects } from "@/lib/mock-data"

type AgentStore = {
  agents: Agent[]
  tasks: Task[]
  projects: Project[]
  assignAgent: (agentId: string, taskId: string) => void
  updateAgentStatus: (agentId: string, status: Agent["status"]) => void
  completeTask: (taskId: string) => void
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "comments" | "progress">) => void
  addComment: (taskId: string, comment: Omit<Comment, "id" | "createdAt">) => void
  updateProgress: (taskId: string, progress: number) => void
}

const AgentStoreContext = createContext<AgentStore | null>(null)

export function AgentStoreProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [projects] = useState<Project[]>(mockProjects)

  const assignAgent = useCallback((agentId: string, taskId: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId)
      setAgents((a) =>
        a.map((ag) =>
          ag.id === agentId
            ? { ...ag, status: "active", currentTask: task?.title, currentProject: projects.find((p) => p.id === task?.projectId)?.name }
            : ag
        )
      )
      return prev.map((t) =>
        t.id === taskId ? { ...t, assignedAgentId: agentId, status: "in_progress", updatedAt: new Date().toISOString() } : t
      )
    })
  }, [projects])

  const updateAgentStatus = useCallback((agentId: string, status: Agent["status"]) => {
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status } : a)))
  }, [])

  const completeTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId)
      if (task?.assignedAgentId) {
        setAgents((a) =>
          a.map((ag) =>
            ag.id === task.assignedAgentId
              ? { ...ag, status: "available", currentTask: undefined, currentProject: undefined }
              : ag
          )
        )
      }
      return prev.map((t) =>
        t.id === taskId ? { ...t, status: "done", progress: 100, updatedAt: new Date().toISOString() } : t
      )
    })
  }, [])

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt" | "updatedAt" | "comments" | "progress">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      progress: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }, [])

  const addComment = useCallback((taskId: string, comment: Omit<Comment, "id" | "createdAt">) => {
    const newComment: Comment = {
      ...comment,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, comments: [...t.comments, newComment], updatedAt: new Date().toISOString() }
          : t
      )
    )
  }, [])

  const updateProgress = useCallback((taskId: string, progress: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, progress, updatedAt: new Date().toISOString() } : t
      )
    )
  }, [])

  return (
    <AgentStoreContext.Provider value={{ agents, tasks, projects, assignAgent, updateAgentStatus, completeTask, addTask, addComment, updateProgress }}>
      {children}
    </AgentStoreContext.Provider>
  )
}

export function useAgentStore() {
  const ctx = useContext(AgentStoreContext)
  if (!ctx) throw new Error("useAgentStore must be used within AgentStoreProvider")
  return ctx
}

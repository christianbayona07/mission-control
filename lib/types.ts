export type AgentStatus = "active" | "available" | "idle" | "offline"

export type Department =
  | "Frontend Development"
  | "Backend Development"
  | "UI/UX Design"
  | "Research & Innovation"
  | "QA & Testing"
  | "DevOps & Infrastructure"

export type Agent = {
  id: string
  name: string
  role: string
  department: Department
  status: AgentStatus
  currentTask?: string
  currentProject?: string
  sessionId?: string
  tokensUsed?: number
  lastActive?: string
  avatar?: string
}

export type TaskStatus = "todo" | "in_progress" | "review" | "done"
export type TaskPriority = "low" | "medium" | "high" | "critical"

export type Task = {
  id: string
  title: string
  description: string
  department: Department
  assignedAgentId?: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  isMvp: boolean
  progress: number // 0-100
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export type ProjectStatus = "planning" | "active" | "paused" | "completed"

export type Project = {
  id: string
  name: string
  description: string
  status: ProjectStatus
  tasks: Task[]
  createdAt: string
  vision?: string
  techStack?: string[]
  features?: string[]
  githubUrl?: string
  workflowProgress?: Record<string, boolean>
  phase2?: string[]
  dataStrategy?: string
  technicalNotes?: string
}

export type Comment = {
  id: string
  author: string // agent name or "Chris"
  content: string
  createdAt: string
  type: "note" | "update" | "blocker"
}

export type GatewaySession = {
  key: string
  label?: string
  model?: string
  status?: string
  tokens?: { used: number; limit: number }
  lastActive?: string
}

import { mockAgents, mockTasks, mockProjects } from "@/lib/mock-data"

describe("Mock Data", () => {
  // Agents
  describe("Agents", () => {
    it("should have agents defined", () => {
      expect(mockAgents).toBeDefined()
      expect(mockAgents.length).toBeGreaterThan(0)
    })

    it("every agent has required fields", () => {
      mockAgents.forEach((agent) => {
        expect(agent.id).toBeTruthy()
        expect(agent.name).toBeTruthy()
        expect(agent.role).toBeTruthy()
        expect(agent.department).toBeTruthy()
        expect(["active", "available", "idle", "offline"]).toContain(agent.status)
      })
    })

    it("active agents should have a current task", () => {
      mockAgents.filter((a) => a.status === "active").forEach((agent) => {
        expect(agent.currentTask).toBeTruthy()
      })
    })
  })

  // Tasks
  describe("Tasks", () => {
    it("should have tasks defined", () => {
      expect(mockTasks).toBeDefined()
      expect(mockTasks.length).toBeGreaterThan(0)
    })

    it("every task has required fields", () => {
      mockTasks.forEach((task) => {
        expect(task.id).toBeTruthy()
        expect(task.title).toBeTruthy()
        expect(task.projectId).toBeTruthy()
        expect(task.department).toBeTruthy()
        expect(["todo", "in_progress", "review", "done"]).toContain(task.status)
        expect(["low", "medium", "high", "critical"]).toContain(task.priority)
        expect(task.progress).toBeGreaterThanOrEqual(0)
        expect(task.progress).toBeLessThanOrEqual(100)
        expect(Array.isArray(task.comments)).toBe(true)
      })
    })

    it("done tasks should have 100% progress", () => {
      mockTasks.filter((t) => t.status === "done").forEach((task) => {
        expect(task.progress).toBe(100)
      })
    })

    it("assigned tasks reference valid agent ids", () => {
      const agentIds = mockAgents.map((a) => a.id)
      mockTasks.filter((t) => t.assignedAgentId).forEach((task) => {
        expect(agentIds).toContain(task.assignedAgentId)
      })
    })

    it("tasks reference valid project ids", () => {
      const projectIds = mockProjects.map((p) => p.id)
      mockTasks.forEach((task) => {
        expect(projectIds).toContain(task.projectId)
      })
    })
  })

  // Projects
  describe("Projects", () => {
    it("should have projects defined", () => {
      expect(mockProjects).toBeDefined()
      expect(mockProjects.length).toBeGreaterThan(0)
    })

    it("every project has required fields", () => {
      mockProjects.forEach((project) => {
        expect(project.id).toBeTruthy()
        expect(project.name).toBeTruthy()
        expect(project.description).toBeTruthy()
        expect(["planning", "active", "paused", "completed"]).toContain(project.status)
      })
    })
  })
})

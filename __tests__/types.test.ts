import { mockAgents, mockTasks, mockProjects } from "@/lib/mock-data"
import type { Agent, Task, Project } from "@/lib/types"

describe("Types integrity", () => {
  it("agents conform to Agent type", () => {
    mockAgents.forEach((agent: Agent) => {
      expect(typeof agent.id).toBe("string")
      expect(typeof agent.name).toBe("string")
      expect(typeof agent.role).toBe("string")
      expect(typeof agent.department).toBe("string")
      expect(typeof agent.status).toBe("string")
    })
  })

  it("tasks conform to Task type", () => {
    mockTasks.forEach((task: Task) => {
      expect(typeof task.id).toBe("string")
      expect(typeof task.title).toBe("string")
      expect(typeof task.isMvp).toBe("boolean")
      expect(typeof task.progress).toBe("number")
      expect(Array.isArray(task.comments)).toBe(true)
    })
  })

  it("projects conform to Project type", () => {
    mockProjects.forEach((project: Project) => {
      expect(typeof project.id).toBe("string")
      expect(typeof project.name).toBe("string")
      expect(Array.isArray(project.tasks)).toBe(true)
    })
  })

  it("comments have required fields", () => {
    const tasksWithComments = mockTasks.filter((t) => t.comments.length > 0)
    expect(tasksWithComments.length).toBeGreaterThan(0)
    tasksWithComments.forEach((task) => {
      task.comments.forEach((comment) => {
        expect(comment.id).toBeTruthy()
        expect(comment.author).toBeTruthy()
        expect(comment.content).toBeTruthy()
        expect(["note", "update", "blocker"]).toContain(comment.type)
        expect(comment.createdAt).toBeTruthy()
      })
    })
  })
})

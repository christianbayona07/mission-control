import { NextResponse } from "next/server"
import { readState, writeState } from "@/lib/state"

export const dynamic = "force-dynamic"

export async function GET() {
  const state = readState()
  // Populate tasks for each project
  const projects = state.projects.map((p: any) => ({
    ...p,
    tasks: state.tasks.filter((t: any) => t.projectId === p.id)
  }))
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  try {
    const project = await req.json()
    const state = readState()
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
      tasks: [],
      createdAt: new Date().toISOString(),
    }
    state.projects.push(newProject)
    writeState(state)
    return NextResponse.json(newProject, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

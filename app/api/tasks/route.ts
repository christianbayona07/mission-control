import { NextResponse } from "next/server"
import { readState, writeState } from "@/lib/state"
import { Task } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function GET() {
  const state = readState()
  return NextResponse.json(state.tasks)
}

export async function POST(req: Request) {
  try {
    const task = await req.json()
    const state = readState()
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      progress: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    state.tasks.push(newTask)
    writeState(state)
    return NextResponse.json(newTask, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json()
    const state = readState()
    state.tasks = state.tasks.map((t: Task) => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
    writeState(state)
    return NextResponse.json(state.tasks)
  } catch {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

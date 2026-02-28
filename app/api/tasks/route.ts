import { NextResponse } from "next/server"
import { readState, writeState } from "@/lib/state"
import { Task, Comment } from "@/lib/types"

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
    const body = await req.json()
    const { id, _addComment, ...updates } = body
    const state = readState()

    state.tasks = state.tasks.map((t: Task) => {
      if (t.id !== id) return t
      if (_addComment) {
        const newComment: Comment = {
          id: `c-${Date.now()}`,
          createdAt: new Date().toISOString(),
          ..._addComment,
        }
        return { ...t, ...updates, comments: [...t.comments, newComment], updatedAt: new Date().toISOString() }
      }
      return { ...t, ...updates, updatedAt: new Date().toISOString() }
    })

    writeState(state)
    return NextResponse.json(state.tasks)
  } catch {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { readState, writeState } from "@/lib/state"

export const dynamic = "force-dynamic"

// GET /api/state — returns full state
export async function GET() {
  try {
    const state = readState()
    return NextResponse.json(state)
  } catch {
    return NextResponse.json({ error: "Failed to read state" }, { status: 500 })
  }
}

// PATCH /api/state — partial update (agents, tasks, projects)
export async function PATCH(req: Request) {
  try {
    const state = readState()
    const body = await req.json()
    const updated = { ...state, ...body }
    writeState(updated)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update state" }, { status: 500 })
  }
}

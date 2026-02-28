import { NextResponse } from "next/server"
import { readState, writeState } from "@/lib/state"
import { Agent } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function GET() {
  const state = readState()
  return NextResponse.json(state.agents)
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json()
    const state = readState()
    state.agents = state.agents.map((a: Agent) => a.id === id ? { ...a, ...updates } : a)
    writeState(state)
    return NextResponse.json(state.agents)
  } catch {
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 })
  }
}

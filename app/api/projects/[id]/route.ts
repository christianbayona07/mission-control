import { NextResponse } from "next/server"
import { readState, writeState } from "@/lib/state"

export const dynamic = "force-dynamic"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const state = readState()
    state.projects = state.projects.map((p: any) =>
      p.id === id ? { ...p, ...body, updatedAt: new Date().toISOString() } : p
    )
    state.updatedAt = new Date().toISOString()
    writeState(state)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

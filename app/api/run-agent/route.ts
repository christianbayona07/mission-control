import { NextResponse } from "next/server"
import { spawn } from "child_process"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { taskId } = await req.json()
    if (!taskId) return NextResponse.json({ error: "taskId required" }, { status: 400 })

    const nodePath = "/usr/local/Cellar/node@22/22.22.0_1/bin/node"
    const runnerPath = "/Users/j.a.r.v.i.s/Projects/mission-control/scripts/run-agent.mjs"

    const proc = spawn(nodePath, [runnerPath, taskId], {
      detached: true,
      stdio: "ignore",
    })
    proc.unref()

    return NextResponse.json({ ok: true, taskId })
  } catch {
    return NextResponse.json({ error: "Failed to spawn agent" }, { status: 500 })
  }
}

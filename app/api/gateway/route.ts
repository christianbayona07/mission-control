import { NextResponse } from "next/server"
import { readFileSync } from "fs"

export const dynamic = "force-dynamic"

const SESSIONS_FILE = "/Users/j.a.r.v.i.s/.openclaw/agents/main/sessions/sessions.json"

export async function GET() {
  try {
    const raw = JSON.parse(readFileSync(SESSIONS_FILE, "utf-8"))
    const entries: [string, any][] = Object.entries(raw)
    const now = Date.now()

    const active = entries
      .filter(([, s]) => {
        const age = now - new Date(s.updatedAt || 0).getTime()
        return age < 1000 * 60 * 60
      })
      .map(([key, s]) => ({
        id: s.sessionId || key,
        key,
        model: s.model || "claude-sonnet-4-6",
        contextTokens: s.contextTokens || 0,
        totalTokens: s.totalTokens || 0,
        updatedAt: s.updatedAt,
        channel: key.includes("telegram") ? "telegram" : key.includes("cron") ? "cron" : "main",
      }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)

    return NextResponse.json({
      active,
      totalSessions: entries.length,
      fetchedAt: new Date().toISOString(),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

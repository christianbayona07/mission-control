import { NextResponse } from "next/server"
import { readFileSync } from "fs"

export const dynamic = "force-dynamic"

const SESSIONS_FILE = "/Users/j.a.r.v.i.s/.openclaw/agents/main/sessions/sessions.json"

export async function GET() {
  try {
    const raw = JSON.parse(readFileSync(SESSIONS_FILE, "utf-8"))
    const sessions: any[] = Array.isArray(raw) ? raw : Object.values(raw)

    const now = Date.now()
    const active = sessions
      .filter((s: any) => {
        const age = now - new Date(s.updatedAt || s.createdAt || 0).getTime()
        return age < 1000 * 60 * 60
      })
      .map((s: any) => ({
        id: s.id,
        key: s.key,
        model: s.model || "claude-sonnet-4-6",
        tokens: s.tokens || 0,
        contextPct: s.contextPct || 0,
        updatedAt: s.updatedAt || s.createdAt,
        channel: s.key?.includes("telegram") ? "telegram" : s.key?.includes("cron") ? "cron" : "main",
      }))
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)

    return NextResponse.json({
      active,
      totalSessions: sessions.length,
      fetchedAt: new Date().toISOString(),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

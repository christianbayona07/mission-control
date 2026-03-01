import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_FILE = join(__dirname, "../data/state.json")

function sync() {
  try {
    const state = JSON.parse(readFileSync(STATE_FILE, "utf-8"))
    const now = new Date().toISOString()

    // Only update lastActive for agents that are ACTUALLY running (running: true)
    state.agents = state.agents.map((a) =>
      a.status === "active" && a.running === true
        ? { ...a, lastActive: now }
        : a
    )

    // Only increment progress for tasks that are ACTUALLY running (running: true)
    state.tasks = state.tasks.map((t) => {
      if (t.running === true && t.status === "in_progress" && t.progress < 90) {
        const inc = Math.floor(Math.random() * 3) + 1
        return { ...t, progress: Math.min(90, t.progress + inc), updatedAt: now }
      }
      return t
    })

    state.updatedAt = now
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
    console.log(`[${new Date().toLocaleTimeString()}] synced`)
  } catch (e) {
    console.error("sync error:", e.message)
  }
}

sync()
setInterval(sync, 30000)

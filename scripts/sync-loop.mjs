import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_FILE = join(__dirname, "../data/state.json")

function sync() {
  try {
    const state = JSON.parse(readFileSync(STATE_FILE, "utf-8"))
    const now = new Date().toISOString()
    state.agents = state.agents.map((a) =>
      a.status === "active" ? { ...a, lastActive: now } : a
    )
    state.tasks = state.tasks.map((t) => {
      if (t.status === "in_progress" && t.progress < 95) {
        const inc = Math.floor(Math.random() * 2)
        return { ...t, progress: Math.min(95, t.progress + inc), updatedAt: now }
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

// Run immediately then every 30s
sync()
setInterval(sync, 30000)

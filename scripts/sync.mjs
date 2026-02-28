#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_FILE = join(__dirname, "../data/state.json")

function sync() {
  const state = JSON.parse(readFileSync(STATE_FILE, "utf-8"))
  const now = new Date().toISOString()

  // Update lastActive for active agents
  state.agents = state.agents.map((agent) =>
    agent.status === "active" ? { ...agent, lastActive: now } : agent
  )

  // Slowly increment in_progress task progress (realistic feel)
  state.tasks = state.tasks.map((task) => {
    if (task.status === "in_progress" && task.progress < 95) {
      const increment = Math.floor(Math.random() * 2)
      return { ...task, progress: Math.min(95, task.progress + increment), updatedAt: now }
    }
    return task
  })

  state.updatedAt = now
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
  console.log(`[${new Date().toLocaleTimeString()}] synced`)
}

sync()

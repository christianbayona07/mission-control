import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { Agent, Task, Project } from "./types"

const STATE_FILE = join(process.cwd(), "data/state.json")

export type AppState = {
  agents: Agent[]
  tasks: Task[]
  projects: Project[]
  updatedAt: string
}

export function readState(): AppState {
  const raw = readFileSync(STATE_FILE, "utf-8")
  return JSON.parse(raw)
}

export function writeState(state: AppState): void {
  state.updatedAt = new Date().toISOString()
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
}

#!/usr/bin/env node
/**
 * task-watcher.mjs — watches state.json and triggers agents on new in_progress tasks
 */
import { readFileSync, watch } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { spawn } from "child_process"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_FILE = join(__dirname, "../data/state.json")
const RUNNER = join(__dirname, "run-agent.mjs")

const runningTasks = new Set()

function readState() {
  try { return JSON.parse(readFileSync(STATE_FILE, "utf-8")) }
  catch { return null }
}

function runAgent(taskId) {
  if (runningTasks.has(taskId)) return
  runningTasks.add(taskId)
  console.log(`[watcher] Spawning agent for task ${taskId}`)

  const proc = spawn("node", [RUNNER, taskId], {
    stdio: "inherit",
    detached: false,
  })

  proc.on("close", (code) => {
    runningTasks.delete(taskId)
    console.log(`[watcher] Agent for ${taskId} finished (code ${code})`)
  })
}

let prevState = readState()

function checkForNewActiveTasks() {
  const state = readState()
  if (!state) return

  state.tasks.forEach(task => {
    // Only trigger if: in_progress + has assigned agent + not already running + wasn't in_progress before
    const prev = prevState?.tasks?.find(t => t.id === task.id)
    const isNewlyActive = task.status === "in_progress" &&
      task.assignedAgentId &&
      task._autoRun === true &&
      prev?.status !== "in_progress"

    if (isNewlyActive) {
      runAgent(task.id)
    }
  })

  prevState = state
}

// Watch for file changes
watch(STATE_FILE, { persistent: true }, (eventType) => {
  if (eventType === "change") {
    setTimeout(checkForNewActiveTasks, 100)
  }
})

console.log(`[watcher] Watching ${STATE_FILE} for task changes...`)
console.log(`[watcher] Ready — will spawn agents for tasks with _autoRun: true`)

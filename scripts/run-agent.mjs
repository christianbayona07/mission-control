#!/usr/bin/env node
import { spawn } from "child_process"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_FILE = join(__dirname, "../data/state.json")
const API = "http://localhost:3001/api"
const PROJECTS_DIR = "/Users/j.a.r.v.i.s/Projects"

const taskId = process.argv[2]
if (!taskId) { console.error("Usage: node run-agent.mjs <taskId>"); process.exit(1) }

function readState() { return JSON.parse(readFileSync(STATE_FILE, "utf-8")) }

async function patchTask(id, updates) {
  await fetch(`${API}/tasks`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...updates }) })
}

async function patchAgent(id, updates) {
  await fetch(`${API}/agents`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...updates }) })
}

async function postComment(taskId, author, content, type = "update") {
  await fetch(`${API}/tasks`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: taskId, _addComment: { author, content, type } }) })
}

async function main() {
  const state = readState()
  const task = state.tasks.find(t => t.id === taskId)
  if (!task) { console.error(`Task ${taskId} not found`); process.exit(1) }

  const agent = state.agents.find(a => a.id === task.assignedAgentId)
  const project = state.projects.find(p => p.id === task.projectId)
  const agentName = agent?.name ?? "JARVIS"
  const projectDir = join(PROJECTS_DIR, project?.name?.toLowerCase().replace(/\s+/g, "-") ?? "mission-control")

  console.log(`[${agentName}] Starting: ${task.title}`)

  // Set running state
  await patchTask(taskId, { running: true, progress: 5 })
  await patchAgent(agent?.id, { status: "active", running: true, currentTask: task.title, currentProject: project?.name, lastActive: new Date().toISOString() })
  await postComment(taskId, agentName, `🚀 Starting: ${task.title}`, "update")

  const prompt = `You are ${agentName}, a ${agent?.role ?? "software engineer"} AI agent working on the Mission Control project.

Task: ${task.title}
Description: ${task.description}
Priority: ${task.priority}
Department: ${task.department}

Instructions:
- Analyze the codebase and implement the task
- Write clean, production-ready code
- Focus on MVP first
- When done, run: curl -s -X PATCH http://localhost:3001/api/tasks -H "Content-Type: application/json" -d '{"id":"${taskId}","progress":95}'

Keep it focused and working.`

  const claude = spawn("claude", ["--dangerously-skip-permissions", prompt], {
    cwd: projectDir,
    env: { ...process.env },
    stdio: ["pipe", "pipe", "pipe"],
  })

  let output = ""
  let lastProgress = 5
  const progressInterval = setInterval(async () => {
    if (lastProgress < 85) {
      lastProgress = Math.min(85, lastProgress + Math.floor(Math.random() * 6) + 2)
      await patchTask(taskId, { progress: lastProgress })
      await patchAgent(agent?.id, { lastActive: new Date().toISOString() })
    }
  }, 20000)

  claude.stdout.on("data", d => { output += d.toString(); process.stdout.write(d) })
  claude.stderr.on("data", d => process.stderr.write(d))

  claude.on("close", async (code) => {
    clearInterval(progressInterval)

    // Clear running state
    await patchTask(taskId, { running: false })
    await patchAgent(agent?.id, { running: false })

    const summary = output.slice(-600).trim()
    if (summary) await postComment(taskId, agentName, summary, "update")

    if (code === 0) {
      await patchTask(taskId, { status: "review", progress: 100, running: false })
      await patchAgent(agent?.id, { status: "available", running: false, currentTask: null, currentProject: null })
      await postComment(taskId, "JARVIS", `✅ ${agentName} completed this task. Moved to review.`, "note")
    } else {
      await postComment(taskId, agentName, `⚠️ Encountered an issue (exit ${code}). Needs attention.`, "blocker")
      await patchTask(taskId, { running: false })
    }
  })
}

main().catch(console.error)

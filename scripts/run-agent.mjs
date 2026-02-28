#!/usr/bin/env node
/**
 * run-agent.mjs — spawns Claude Code for a task and reports back to Mission Control
 * Usage: node run-agent.mjs <taskId>
 */
import { spawn } from "child_process"
import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_FILE = join(__dirname, "../data/state.json")
const API = "http://localhost:3001/api"
const PROJECTS_DIR = "/Users/j.a.r.v.i.s/Projects"

const taskId = process.argv[2]
if (!taskId) { console.error("Usage: node run-agent.mjs <taskId>"); process.exit(1) }

function readState() { return JSON.parse(readFileSync(STATE_FILE, "utf-8")) }

async function postComment(taskId, author, content, type = "update") {
  try {
    await fetch(`${API}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, _addComment: { author, content, type } }),
    })
  } catch(e) { console.error("Failed to post comment:", e.message) }
}

async function updateProgress(taskId, progress) {
  try {
    await fetch(`${API}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, progress }),
    })
  } catch(e) { console.error("Failed to update progress:", e.message) }
}

async function completeTask(taskId, agentId) {
  try {
    await fetch(`${API}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, status: "done", progress: 100 }),
    })
    if (agentId) {
      await fetch(`${API}/agents`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agentId, status: "available", currentTask: null, currentProject: null }),
      })
    }
  } catch(e) { console.error("Failed to complete task:", e.message) }
}

async function main() {
  const state = readState()
  const task = state.tasks.find(t => t.id === taskId)
  if (!task) { console.error(`Task ${taskId} not found`); process.exit(1) }

  const agent = state.agents.find(a => a.id === task.assignedAgentId)
  const project = state.projects.find(p => p.id === task.projectId)
  const agentName = agent?.name ?? "JARVIS"
  const projectDir = join(PROJECTS_DIR, project?.name?.toLowerCase().replace(/\s+/g, "-") ?? "mission-control")

  console.log(`[${agentName}] Starting task: ${task.title}`)
  console.log(`[${agentName}] Project dir: ${projectDir}`)

  await postComment(taskId, agentName, `Starting work on: ${task.title}. Analyzing codebase...`, "update")
  await updateProgress(taskId, 10)

  const prompt = `You are ${agentName}, a ${agent?.role ?? "software engineer"} AI agent.

Your task: ${task.title}
Description: ${task.description}
Priority: ${task.priority}
Department: ${task.department}

Instructions:
1. Analyze the codebase and understand the current state
2. Implement the task fully and correctly
3. Write clean, production-ready code
4. After completing, run: curl -s -X PATCH http://localhost:3001/api/tasks -H "Content-Type: application/json" -d '{"id":"${taskId}","progress":90,"status":"review"}'
5. When completely finished, run: openclaw system event --text "Agent ${agentName} completed task: ${task.title}" --mode now

Focus on the MVP. Keep it clean and working.`

  const claude = spawn("claude", ["--dangerously-skip-permissions", prompt], {
    cwd: projectDir,
    env: { ...process.env },
    stdio: ["pipe", "pipe", "pipe"],
  })

  let output = ""
  let lastProgress = 10
  let progressInterval = setInterval(async () => {
    if (lastProgress < 85) {
      lastProgress += Math.floor(Math.random() * 8) + 3
      await updateProgress(taskId, Math.min(85, lastProgress))
    }
  }, 30000)

  claude.stdout.on("data", (data) => {
    const text = data.toString()
    output += text
    process.stdout.write(text)
  })

  claude.stderr.on("data", (data) => {
    process.stderr.write(data.toString())
  })

  claude.on("close", async (code) => {
    clearInterval(progressInterval)
    console.log(`\n[${agentName}] Process exited with code ${code}`)

    // Post a summary comment
    const summary = output.slice(-800).trim()
    if (summary) {
      await postComment(taskId, agentName, `Work complete. Summary:\n${summary}`, "update")
    }

    if (code === 0) {
      await completeTask(taskId, agent?.id)
      await postComment(taskId, "JARVIS", `${agentName} has completed this task. Ready for review.`, "note")
      console.log(`[JARVIS] Task ${taskId} marked complete.`)
    } else {
      await postComment(taskId, agentName, `Encountered an issue (exit code ${code}). Needs attention.`, "blocker")
      await updateProgress(taskId, lastProgress)
    }
  })
}

main().catch(console.error)

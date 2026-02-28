import { writeFileSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_FILE = join(__dirname, "../data/state.json")

// Don't overwrite existing state
if (existsSync(STATE_FILE)) {
  console.log("state.json already exists, skipping init.")
  process.exit(0)
}

const now = new Date().toISOString()
const ago = (mins) => new Date(Date.now() - 1000 * 60 * mins).toISOString()

const state = {
  agents: [
    { id: "agent-001", name: "ARIA", role: "Senior Frontend Engineer", department: "Frontend Development", status: "active", currentTask: "Build Office View & Task Detail panel", currentProject: "Mission Control", tokensUsed: 42300, lastActive: now },
    { id: "agent-002", name: "KODA", role: "Backend Architect", department: "Backend Development", status: "available", tokensUsed: 18700, lastActive: ago(20) },
    { id: "agent-003", name: "VELA", role: "UI/UX Lead Designer", department: "UI/UX Design", status: "available", tokensUsed: 12400, lastActive: ago(15) },
    { id: "agent-004", name: "NEXUS", role: "Research Analyst", department: "Research & Innovation", status: "idle", tokensUsed: 5200, lastActive: ago(45) },
    { id: "agent-005", name: "PULSE", role: "QA Engineer", department: "QA & Testing", status: "active", currentTask: "Run test suite & verify all 14 tests pass", currentProject: "Mission Control", tokensUsed: 18900, lastActive: now },
    { id: "agent-006", name: "FORGE", role: "DevOps Engineer", department: "DevOps & Infrastructure", status: "active", currentTask: "Configure PM2 for 24/7 uptime", currentProject: "Mission Control", tokensUsed: 33600, lastActive: now },
  ],
  tasks: [
    { id: "task-001", title: "Mission Control dashboard — core layout", description: "Build the main dashboard with sidebar, stats bar, departments, agent roster and task feed.", department: "Frontend Development", assignedAgentId: "agent-001", status: "done", priority: "critical", projectId: "proj-001", isMvp: true, progress: 100, comments: [{ id: "c-001", author: "ARIA", content: "Dashboard layout complete. Sidebar nav, stats bar, 3-column grid all working. Pushed to main.", createdAt: ago(180), type: "update" }], createdAt: ago(300), updatedAt: ago(180) },
    { id: "task-002", title: "Office View — virtual floor plan", description: "Visual representation of agents at desks, organized by department zones with live status glows.", department: "Frontend Development", assignedAgentId: "agent-001", status: "done", priority: "high", projectId: "proj-001", isMvp: true, progress: 100, comments: [{ id: "c-002", author: "ARIA", content: "Office view built. 6 department zones, agent desks with glow effects, hover tooltips, click detail card.", createdAt: ago(120), type: "update" }], createdAt: ago(240), updatedAt: ago(120) },
    { id: "task-003", title: "Task Detail panel with comments", description: "Slide-in panel showing task progress, activity log, and ability to add notes/updates/blockers.", department: "Frontend Development", assignedAgentId: "agent-001", status: "done", priority: "critical", projectId: "proj-001", isMvp: true, progress: 100, comments: [{ id: "c-003", author: "ARIA", content: "Task detail panel complete. Progress bar, comment types (note/update/blocker), Cmd+Enter to post.", createdAt: ago(60), type: "update" }, { id: "c-004", author: "JARVIS", content: "Solid work. This is the foundation for agent-to-agent communication on tasks.", createdAt: ago(45), type: "note" }], createdAt: ago(180), updatedAt: ago(45) },
    { id: "task-004", title: "PM2 — 24/7 uptime configuration", description: "Set up PM2 process manager with launchd so Mission Control runs on every reboot automatically.", department: "DevOps & Infrastructure", assignedAgentId: "agent-006", status: "done", priority: "high", projectId: "proj-001", isMvp: true, progress: 100, comments: [{ id: "c-005", author: "FORGE", content: "PM2 configured. LaunchAgent plist written, startup script registered. Mission Control survives reboots.", createdAt: ago(30), type: "update" }], createdAt: ago(120), updatedAt: ago(30) },
    { id: "task-005", title: "Test suite — 14 passing tests", description: "Jest test suite covering mock data integrity, type conformance, agent/task/project validation.", department: "QA & Testing", assignedAgentId: "agent-005", status: "done", priority: "high", projectId: "proj-001", isMvp: true, progress: 100, comments: [{ id: "c-006", author: "PULSE", content: "14/14 tests passing. Lint clean, build clean. Ready to connect real data.", createdAt: ago(10), type: "update" }], createdAt: ago(60), updatedAt: ago(10) },
    { id: "task-006", title: "Connect Mission Control to real GitHub data", description: "Replace mock projects/tasks with live data pulled from GitHub repos, issues, and PRs.", department: "Backend Development", status: "todo", priority: "critical", projectId: "proj-001", isMvp: true, progress: 0, comments: [], createdAt: now, updatedAt: now },
    { id: "task-007", title: "Connect OpenClaw gateway — live agent sessions", description: "Pull real agent session data from OpenClaw gateway API and map to agent statuses in real-time.", department: "Backend Development", status: "todo", priority: "critical", projectId: "proj-001", isMvp: true, progress: 0, comments: [], createdAt: now, updatedAt: now },
    { id: "task-008", title: "Remote access — expose via Tailscale or tunnel", description: "Make Mission Control accessible from any device outside the local network.", department: "DevOps & Infrastructure", status: "todo", priority: "high", projectId: "proj-001", isMvp: false, progress: 0, comments: [], createdAt: now, updatedAt: now },
    { id: "task-009", title: "UI polish — animations and theme refinements", description: "Upgrade the visual design with smoother animations, better spacing, and refined color palette.", department: "UI/UX Design", status: "todo", priority: "medium", projectId: "proj-001", isMvp: false, progress: 0, comments: [], createdAt: now, updatedAt: now },
    { id: "task-010", title: "GitHub integration — push Mission Control repo", description: "Initialize git, connect to GitHub, push mission-control to christianbayona07/mission-control.", department: "DevOps & Infrastructure", assignedAgentId: "agent-006", status: "done", priority: "medium", projectId: "proj-001", isMvp: false, progress: 100, comments: [{ id: "c-007", author: "FORGE", content: "Repo created at github.com/christianbayona07/mission-control. SSH configured, initial commit pushed.", createdAt: ago(60), type: "update" }], createdAt: ago(120), updatedAt: ago(60) },
  ],
  projects: [
    { id: "proj-001", name: "Mission Control", description: "AI agent operations dashboard — real-time visibility into agents, tasks, and projects", status: "active", tasks: [], createdAt: ago(1440) },
  ],
  updatedAt: now,
}

writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
console.log("✅ state.json initialized at", STATE_FILE)

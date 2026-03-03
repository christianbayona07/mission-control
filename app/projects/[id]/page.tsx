"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAgentStore } from "@/hooks/useAgentStore"
import { TaskCard } from "@/components/TaskCard"
import { TaskDetail } from "@/components/TaskDetail"
import { Task } from "@/lib/types"
import { ArrowLeft, Github, ExternalLink, CheckSquare, Square, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react"

const STATUS_OPTIONS = ["planning", "active", "paused", "completed"] as const

const STATUS_COLOR: Record<string, string> = {
  planning:  "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  active:    "text-green-400 border-green-400/40 bg-green-400/10",
  paused:    "text-amber-400 border-amber-400/40 bg-amber-400/10",
  completed: "text-slate-400 border-slate-400/40 bg-slate-400/10",
}

const PHASES = [
  { id: 0, name: "Project Setup", color: "text-slate-400 border-slate-400/30", goal: "Before writing a single line of code", sections: [
    { title: "Repository & Tooling", items: ["Create GitHub repo (private)", "Initialize Next.js + TypeScript + Tailwind", "Set up .env.local template", "Configure ESLint + Prettier", "Add to Mission Control", "Create Supabase project", "Set up Vercel project", "Set up Railway (if needed)"] },
    { title: "Business Setup", items: ["Register business name / LLC", "Open dedicated business bank account", "Create Stripe account", "Register domain name", "Set up business email"] }
  ]},
  { id: 1, name: "Demo / Prototype", color: "text-cyan-400 border-cyan-400/30", goal: "Something clickable in 1-3 days", sections: [
    { title: "What to Build", items: ["Core UI screens (mock data)", "Mobile-responsive from day one", "Deployed to Vercel with real URL", "Covers 2-3 core user flows end to end", "Looks production-quality"] }
  ]},
  { id: 2, name: "MVP Development", color: "text-blue-400 border-blue-400/30", goal: "Real users can use it end to end", sections: [
    { title: "Backend", items: ["Supabase schema designed and migrated", "Row Level Security (RLS) policies set", "API routes built and tested", "Authentication flow complete", "File storage configured", "Error handling on all endpoints"] },
    { title: "Frontend", items: ["All MVP screens connected to real API", "Auth flow: sign up, log in, log out, password reset", "Loading, error, empty states on every screen", "Mobile-responsive tested", "Form validation on all inputs"] },
    { title: "Payments", items: ["Stripe connected", "Products and pricing in Stripe dashboard", "Checkout flow tested", "Webhooks set up", "Test mode verified end-to-end"] },
    { title: "Notifications", items: ["SendGrid configured", "Twilio SMS configured (if applicable)", "Email templates designed", "Unsubscribe flow in place"] },
    { title: "Testing", items: ["Core flows tested end-to-end", "Edge cases covered", "Tested on Chrome, Safari, Firefox", "Tested on iOS Safari + Android Chrome"] }
  ]},
  { id: 3, name: "External Integrations", color: "text-purple-400 border-purple-400/30", goal: "Connect all third-party services", sections: [
    { title: "Integration Checklist", items: ["All API keys in environment variables", "OAuth apps registered", "Webhooks registered and verified", "Rate limits documented and handled", "Fallback behavior when APIs are down", "API costs within budget"] }
  ]},
  { id: 4, name: "Security & Compliance", color: "text-orange-400 border-orange-400/30", goal: "Non-negotiable before any real user", sections: [
    { title: "Security", items: ["All env vars in .env — never in code", "HTTPS enforced", "Supabase RLS on all tables", "Input sanitization on all fields", "File upload validation", "Rate limiting on API routes", "CORS configured", "npm audit clean"] },
    { title: "Data & Privacy", items: ["Only collect necessary data", "User data deletion flow", "Cookie consent banner (if needed)", "Data retention policy defined"] }
  ]},
  { id: 5, name: "Legal & Business", color: "text-red-400 border-red-400/30", goal: "Required before accepting real users", sections: [
    { title: "Legal Documents", items: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Refund Policy", "Acceptable Use Policy"] },
    { title: "Business Requirements", items: ["Stripe fully verified", "Tax settings in Stripe", "Business entity registered", "Domain email + SendGrid connected", "Support channel ready"] }
  ]},
  { id: 6, name: "Pre-Launch", color: "text-yellow-400 border-yellow-400/30", goal: "Final checks before going live", sections: [
    { title: "Performance", items: ["Lighthouse score > 85", "Images optimized", "No console errors in production", "Page load < 3s on mobile"] },
    { title: "SEO", items: ["Title tags and meta descriptions", "OG image for social sharing", "Sitemap generated", "Google Search Console connected"] },
    { title: "Monitoring", items: ["Sentry connected", "PostHog connected", "Uptime monitor set up", "Alerts for downtime and errors"] },
    { title: "Final QA", items: ["Full end-to-end test with real account", "Payment tested with real card", "All legal pages live in footer", "404 page looks good"] }
  ]},
  { id: 7, name: "Launch", color: "text-green-400 border-green-400/30", goal: "Ship it", sections: [
    { title: "Launch Day", items: ["Flip to production environment", "Announce on chosen channels", "Monitor Sentry + PostHog for 48h", "Ready to hotfix same day", "Gather first user feedback"] }
  ]},
  { id: 8, name: "Post-Launch", color: "text-teal-400 border-teal-400/30", goal: "Iterate and grow", sections: [
    { title: "Week 1", items: ["Review first week metrics", "Fix top 3 friction points", "Weekly review cadence in Mission Control", "Begin planning next milestone"] }
  ]}
]

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { projects, tasks, agents, completeTask, addComment, updateProgress } = useAgentStore()
  const project = projects.find(p => p.id === id)
  const projectTasks = tasks.filter(t => t.projectId === id)
  const mvpTasks = projectTasks.filter(t => t.isMvp)
  const niceTasks = projectTasks.filter(t => !t.isMvp)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true })
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState(project?.status ?? "active")
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"workflow" | "tasks">("workflow")

  useEffect(() => {
    if (project?.workflowProgress) setChecked(project.workflowProgress as Record<string, boolean>)
    if (project?.status) setStatus(project.status)
  }, [project])

  if (!project) return <div className="p-6 text-slate-500">Project not found</div>

  const toggleCheck = async (key: string) => {
    const next = { ...checked, [key]: !checked[key] }
    setChecked(next)
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflowProgress: next })
    })
  }

  const changeStatus = async (s: string) => {
    setStatus(s as any)
    setSaving(true)
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s })
    })
    setSaving(false)
  }

  const totalItems = PHASES.flatMap(p => p.sections.flatMap(s => s.items)).length
  const doneItems = Object.values(checked).filter(Boolean).length
  const pct = Math.round((doneItems / totalItems) * 100)

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Back */}
      <button onClick={() => router.push("/projects")} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </button>

      {/* Header */}
      <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-white text-2xl font-bold font-mono">{project.name}</h1>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-500 hover:text-white transition-colors text-xs">
                  <Github className="w-4 h-4" /><ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-slate-400 text-sm">{project.description}</p>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2">
            {saving && <span className="text-slate-600 text-xs">saving...</span>}
            <div className="flex gap-1">
              {STATUS_OPTIONS.map(s => (
                <button key={s} onClick={() => changeStatus(s)}
                  className={`px-2 py-1 rounded border text-xs font-mono font-bold transition-all ${status === s ? STATUS_COLOR[s] : "text-slate-600 border-slate-700 hover:border-slate-500"}`}>
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vision */}
        {project.vision && (
          <p className="text-slate-300 text-sm leading-relaxed bg-[#0a0a0f] rounded-lg px-4 py-3 border border-[#1a1a2e]">
            {project.vision}
          </p>
        )}

        {/* Overall progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>WORKFLOW PROGRESS</span>
            <span>{doneItems}/{totalItems} ({pct}%)</span>
          </div>
          <div className="h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 rounded-full"
              style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Tech stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((t: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded border border-purple-400/20 bg-purple-400/10 text-purple-300 text-xs font-mono">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["workflow", "tasks"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg border font-mono text-xs font-bold transition-all ${activeTab === tab ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-400" : "border-[#1a1a2e] text-slate-500 hover:text-slate-300"}`}>
            {tab.toUpperCase()} {tab === "tasks" ? `(${projectTasks.length})` : ""}
          </button>
        ))}
      </div>

      {/* Workflow tab */}
      {activeTab === "workflow" && (
        <div className="space-y-3">
          {PHASES.map(phase => {
            const allItems = phase.sections.flatMap((s, si) => s.items.map((item, ii) => ({ item, si, ii })))
            const doneCnt = allItems.filter(({ si, ii }) => checked[`${phase.id}-${si}-${ii}`]).length
            const isOpen = expanded[phase.id]

            return (
              <div key={phase.id} className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl overflow-hidden">
                <button onClick={() => setExpanded(e => ({ ...e, [phase.id]: !isOpen }))}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#111120] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${phase.color}`}>{phase.id}</span>
                    <div className="text-left">
                      <div className="text-white font-bold font-mono text-sm">{phase.name.toUpperCase()}</div>
                      <div className="text-slate-500 text-xs">{phase.goal}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono ${doneCnt === allItems.length ? "text-green-400" : "text-slate-500"}`}>
                      {doneCnt}/{allItems.length}
                    </span>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-[#1a1a2e] pt-4">
                    {phase.sections.map((section, si) => (
                      <div key={si} className="space-y-1.5">
                        <div className="text-slate-400 font-mono text-xs font-bold tracking-wider">{section.title.toUpperCase()}</div>
                        {section.items.map((item, ii) => {
                          const key = `${phase.id}-${si}-${ii}`
                          const done = checked[key]
                          return (
                            <button key={ii} onClick={() => toggleCheck(key)} className="flex items-start gap-2.5 w-full text-left group">
                              {done
                                ? <CheckSquare className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                : <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0 mt-0.5 transition-colors" />}
                              <span className={`text-sm leading-relaxed transition-colors ${done ? "text-slate-500 line-through" : "text-slate-300 group-hover:text-white"}`}>
                                {item}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Tasks tab */}
      {activeTab === "tasks" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold mb-3">
              <AlertTriangle className="w-3.5 h-3.5" /> MVP ({mvpTasks.length})
            </div>
            {mvpTasks.map(task => (
              <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                <TaskCard task={task} agentName={agents.find(a => a.id === task.assignedAgentId)?.name} onComplete={completeTask} />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="text-slate-500 font-mono text-xs font-bold mb-3">NICE-TO-HAVE ({niceTasks.length})</div>
            {niceTasks.length === 0 && <div className="text-slate-700 text-xs">None yet</div>}
            {niceTasks.map(task => (
              <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                <TaskCard task={task} agentName={agents.find(a => a.id === task.assignedAgentId)?.name} onComplete={completeTask} />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTask && (
        <TaskDetail task={selectedTask} agent={agents.find(a => a.id === selectedTask.assignedAgentId)}
          onClose={() => setSelectedTask(null)} onAddComment={addComment} onUpdateProgress={updateProgress}
          onComplete={(id) => { completeTask(id); setSelectedTask(null) }} />
      )}
    </div>
  )
}

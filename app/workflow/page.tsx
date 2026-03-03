"use client"

import { useState } from "react"
import { CheckSquare, Square, ChevronDown, ChevronRight } from "lucide-react"

const PHASES = [
  {
    id: 0,
    name: "Project Setup",
    color: "text-slate-400 border-slate-400/30 bg-slate-400/10",
    dot: "bg-slate-400",
    goal: "Before writing a single line of code",
    sections: [
      {
        title: "Repository & Tooling",
        items: [
          "Create GitHub repo (private) — christianbayona07/project-name",
          "Initialize Next.js + TypeScript + Tailwind",
          "Set up .env.local template with all required keys",
          "Configure ESLint + Prettier",
          "Add to Mission Control (project + tasks + agents)",
          "Create Supabase project — get DB URL and anon key",
          "Set up Vercel project linked to GitHub repo",
          "Set up Railway project for backend (if needed)",
        ]
      },
      {
        title: "Business Setup",
        items: [
          "Register business name / LLC (if not already)",
          "Open dedicated business bank account",
          "Create Stripe account (or sub-account per product)",
          "Register domain name",
          "Set up business email (e.g. hello@projectname.com)",
        ]
      }
    ]
  },
  {
    id: 1,
    name: "Demo / Prototype",
    color: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    dot: "bg-cyan-400",
    goal: "Something clickable in 1-3 days",
    sections: [
      {
        title: "What to Build",
        items: [
          "Core UI screens (no real backend needed)",
          "Hardcoded mock data — show the vision, not the plumbing",
          "Mobile-responsive from day one",
          "Deployed to Vercel with a real URL (not localhost)",
        ]
      },
      {
        title: "Definition of Done",
        items: [
          "Can demo to a potential customer or investor in 5 minutes",
          "Covers the 2-3 core user flows end to end",
          "Looks production-quality (design matters here)",
        ]
      }
    ]
  },
  {
    id: 2,
    name: "MVP Development",
    color: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    dot: "bg-blue-400",
    goal: "Real users can use it end to end",
    sections: [
      {
        title: "Backend",
        items: [
          "Supabase schema designed and migrated",
          "Row Level Security (RLS) policies set",
          "API routes built and tested",
          "Authentication flow complete (Supabase Auth)",
          "File storage configured",
          "Error handling and input validation on all endpoints",
        ]
      },
      {
        title: "Frontend",
        items: [
          "All MVP screens built and connected to real API",
          "Auth flow: sign up, log in, log out, password reset",
          "Loading, error, and empty states on every screen",
          "Mobile-responsive tested on iOS and Android",
          "Form validation on all user inputs",
        ]
      },
      {
        title: "Payments (Stripe)",
        items: [
          "Stripe account connected to project",
          "Products and pricing created in Stripe dashboard",
          "Checkout flow implemented and tested",
          "Webhooks set up for payment events",
          "Test mode verified end-to-end before going live",
        ]
      },
      {
        title: "Notifications",
        items: [
          "SendGrid configured — transactional emails",
          "Twilio configured — SMS alerts (if applicable)",
          "Email templates designed and tested",
          "Unsubscribe / opt-out flow in place",
        ]
      },
      {
        title: "Testing",
        items: [
          "Core user flows manually tested end-to-end",
          "Edge cases covered (empty inputs, failed payments)",
          "Tested on Chrome, Safari, Firefox",
          "Tested on mobile (iOS Safari + Android Chrome)",
        ]
      }
    ]
  },
  {
    id: 3,
    name: "External Integrations",
    color: "text-purple-400 border-purple-400/30 bg-purple-400/10",
    dot: "bg-purple-400",
    goal: "Connect all third-party services",
    sections: [
      {
        title: "Integration Checklist",
        items: [
          "All API keys obtained and stored in environment variables",
          "OAuth apps registered (Google, LinkedIn, Meta, etc.)",
          "Webhooks registered and verified",
          "Rate limits documented and handled in code",
          "Fallback behavior when third-party APIs are down",
          "API costs estimated and within budget",
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Security & Compliance",
    color: "text-orange-400 border-orange-400/30 bg-orange-400/10",
    dot: "bg-orange-400",
    goal: "Non-negotiable before any real user touches it",
    sections: [
      {
        title: "Security",
        items: [
          "All environment variables in .env — never in code",
          "HTTPS enforced (Vercel handles automatically)",
          "Supabase RLS enabled on all tables",
          "Input sanitization on all user-facing fields",
          "File upload validation (type, size limits)",
          "Rate limiting on API routes",
          "CORS configured correctly",
          "Dependency audit — npm audit clean",
        ]
      },
      {
        title: "Data & Privacy (GDPR / CCPA basics)",
        items: [
          "Only collect data you actually need",
          "User data deletion flow implemented",
          "Cookies: only set what's necessary",
          "Cookie consent banner (if using tracking/analytics)",
          "Data retention policy defined",
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Legal & Business",
    color: "text-red-400 border-red-400/30 bg-red-400/10",
    dot: "bg-red-400",
    goal: "Required before accepting real money or real users",
    sections: [
      {
        title: "Legal Documents (Required)",
        items: [
          "Terms of Service — rules, user responsibilities, liability limits",
          "Privacy Policy — data collection, usage, and storage",
          "Cookie Policy — if using non-essential cookies",
          "Refund Policy — if selling subscriptions or products",
          "Acceptable Use Policy — for platforms with user-generated content",
        ]
      },
      {
        title: "Platform-Specific",
        items: [
          "Marketplace Terms — for RentAnything, NestMatch (buyer/seller rules)",
          "SaaS Agreement — for B2B products (CompeteIQ, RentFlow, InspectPro)",
          "White-label License Agreement — for InspectPro, RentFlow clients",
          "Data Processing Agreement (DPA) — if handling EU user data",
        ]
      },
      {
        title: "Business Requirements",
        items: [
          "Stripe account fully verified (business details, bank account)",
          "Tax settings configured in Stripe",
          "Business entity registered",
          "Domain email set up and linked to SendGrid",
          "Support channel ready before launch",
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Pre-Launch",
    color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    dot: "bg-yellow-400",
    goal: "Final checks before flipping the switch",
    sections: [
      {
        title: "Performance",
        items: [
          "Lighthouse score > 85 on mobile and desktop",
          "Images optimized (Next.js Image component)",
          "No console errors in production build",
          "Page load < 3 seconds on mobile",
        ]
      },
      {
        title: "SEO & Discoverability",
        items: [
          "Title tags and meta descriptions on all pages",
          "OG image for social sharing",
          "Sitemap generated",
          "robots.txt configured",
          "Google Search Console connected",
        ]
      },
      {
        title: "Monitoring",
        items: [
          "Sentry connected — error tracking live",
          "PostHog connected — user analytics live",
          "Uptime monitor set up (UptimeRobot free tier)",
          "Alerts set up for downtime and error spikes",
        ]
      },
      {
        title: "Final QA",
        items: [
          "Full end-to-end test with a real user account",
          "Payment flow tested with real card (small amount)",
          "All legal pages live and linked in footer",
          "Support email monitored",
          "404 page exists and looks good",
          "All social/marketing links work",
        ]
      }
    ]
  },
  {
    id: 7,
    name: "Launch",
    color: "text-green-400 border-green-400/30 bg-green-400/10",
    dot: "bg-green-400",
    goal: "Ship it",
    sections: [
      {
        title: "Launch Day",
        items: [
          "Flip environment from staging to production",
          "Announce on chosen channels",
          "Monitor Sentry + PostHog for first 48 hours",
          "Be ready to hotfix same day if critical issues arise",
          "Gather first user feedback immediately",
        ]
      }
    ]
  },
  {
    id: 8,
    name: "Post-Launch",
    color: "text-teal-400 border-teal-400/30 bg-teal-400/10",
    dot: "bg-teal-400",
    goal: "Iterate and grow",
    sections: [
      {
        title: "Week 1",
        items: [
          "Review first week metrics (signups, activation, drop-off)",
          "Fix top 3 friction points from user feedback",
          "Set up weekly review cadence in Mission Control",
          "Begin planning next milestone",
        ]
      }
    ]
  }
]

export default function WorkflowPage() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true })
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggle = (phaseId: number) =>
    setExpanded(e => ({ ...e, [phaseId]: !e[phaseId] }))

  const toggleCheck = (key: string) =>
    setChecked(c => ({ ...c, [key]: !c[key] }))

  const phaseProgress = (phase: typeof PHASES[0]) => {
    const total = phase.sections.flatMap(s => s.items).length
    const done = phase.sections.flatMap(s => s.items).filter((_, i) =>
      checked[`${phase.id}-${phase.sections.findIndex(s => s.items.includes(_))}-${i}`]
    ).length
    return { total, done }
  }

  return (
    <div className="p-6 space-y-4 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-mono text-white tracking-wider">WORKFLOW</h1>
        <p className="text-slate-500 text-sm font-mono mt-0.5">FROM ZERO TO LIVE — APPLIES TO ALL PROJECTS</p>
      </div>

      {/* Phase timeline */}
      <div className="flex items-center gap-1 flex-wrap py-2">
        {PHASES.map((phase, i) => (
          <div key={phase.id} className="flex items-center gap-1">
            <button
              onClick={() => toggle(phase.id)}
              className={`px-2 py-1 rounded border text-xs font-mono font-bold transition-all ${phase.color}`}
            >
              {phase.id} · {phase.name}
            </button>
            {i < PHASES.length - 1 && <span className="text-slate-700 text-xs">→</span>}
          </div>
        ))}
      </div>

      {/* Phase cards */}
      <div className="space-y-3">
        {PHASES.map(phase => {
          const isOpen = expanded[phase.id]
          const allItems = phase.sections.flatMap((s, si) => s.items.map((item, ii) => ({ item, si, ii })))
          const doneCount = allItems.filter(({ si, ii }) => checked[`${phase.id}-${si}-${ii}`]).length

          return (
            <div key={phase.id} className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl overflow-hidden">
              <button
                onClick={() => toggle(phase.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#111120] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${phase.color}`}>
                    {phase.id}
                  </span>
                  <div className="text-left">
                    <div className="text-white font-bold font-mono">{phase.name.toUpperCase()}</div>
                    <div className="text-slate-500 text-xs">{phase.goal}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs font-mono">{doneCount}/{allItems.length}</span>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-5 border-t border-[#1a1a2e] pt-4">
                  {phase.sections.map((section, si) => (
                    <div key={si} className="space-y-2">
                      <div className="text-slate-400 font-mono text-xs font-bold tracking-wider">{section.title.toUpperCase()}</div>
                      <div className="space-y-1">
                        {section.items.map((item, ii) => {
                          const key = `${phase.id}-${si}-${ii}`
                          const done = checked[key]
                          return (
                            <button
                              key={ii}
                              onClick={() => toggleCheck(key)}
                              className="flex items-start gap-2.5 w-full text-left group"
                            >
                              {done
                                ? <CheckSquare className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                : <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0 mt-0.5 transition-colors" />
                              }
                              <span className={`text-sm leading-relaxed transition-colors ${done ? "text-slate-500 line-through" : "text-slate-300 group-hover:text-white"}`}>
                                {item}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

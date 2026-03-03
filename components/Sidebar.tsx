"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, Bot, FolderKanban, Activity, Building, ClipboardList } from "lucide-react"

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/office", label: "Office View", icon: Building },
  { href: "/departments", label: "Departments", icon: Building2 },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/workflow", label: "Workflow", icon: ClipboardList },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-[#0a0a0f] border-r border-[#1a1a2e] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#1a1a2e]">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-mono font-bold text-sm tracking-widest">MISSION CTRL</span>
        </div>
        <div className="text-slate-600 font-mono text-xs mt-0.5 tracking-wider">v1.0 · JARVIS</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all ${
                active
                  ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 shadow-[0_0_12px_rgba(0,212,255,0.1)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#1a1a2e]">
        <div className="text-slate-600 font-mono text-xs">GATEWAY</div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 font-mono text-xs">localhost:18789</span>
        </div>
      </div>
    </aside>
  )
}

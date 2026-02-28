"use client"

import { useEffect, useState } from "react"

export function LiveClock() {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour12: false }))
      setDate(now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }))
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <div className="text-cyan-400 font-mono text-sm font-bold">{time}</div>
        <div className="text-slate-500 font-mono text-xs">{date}</div>
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-green-400/40 bg-green-400/10">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#00ff88]" />
        <span className="text-green-400 font-mono text-xs font-bold">LIVE</span>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { fetchGatewaySessions, fetchGatewayStatus } from "@/lib/gateway"
import { GatewaySession } from "@/lib/types"

export function useGateway(pollInterval = 30000) {
  const [sessions, setSessions] = useState<GatewaySession[]>([])
  const [online, setOnline] = useState(false)
  const [lastPoll, setLastPoll] = useState<Date | null>(null)

  const poll = async () => {
    const [status, sessions] = await Promise.all([fetchGatewayStatus(), fetchGatewaySessions()])
    setOnline(status)
    setSessions(sessions)
    setLastPoll(new Date())
  }

  useEffect(() => {
    poll()
    const interval = setInterval(poll, pollInterval)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollInterval])

  return { sessions, online, lastPoll }
}

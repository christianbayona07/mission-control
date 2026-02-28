import { GatewaySession } from "./types"

const GATEWAY_URL = "http://localhost:18789"

export async function fetchGatewaySessions(): Promise<GatewaySession[]> {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/sessions`, {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : data.sessions ?? []
  } catch {
    return []
  }
}

export async function fetchGatewayStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/status`, {
      signal: AbortSignal.timeout(2000),
    })
    return res.ok
  } catch {
    return false
  }
}

export const inr = n => '₹ ' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })
export const STATUS = { ON_TRACK: 'On track', DELAYED: 'Delayed', AT_RISK: 'At risk', COMPLETED: 'Completed', STALLED: 'Stalled' }
export const fmtDate = d => d ? new Date(d).toLocaleDateString('en-GB') : '–'
export function riskOf(p) {
  const base = { ON_TRACK: 20, COMPLETED: 5, DELAYED: 55, AT_RISK: 75, STALLED: 85 }[p.status] ?? 30
  const over = p.original ? (p.revised - p.original) / p.original : 0
  const score = Math.min(98, Math.round(base + over * 60))
  return { score, level: score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 35 ? 'MEDIUM' : 'LOW', overrun: Math.max(0, over * 100) }
}
const icons = { 'Transport & Logistics': '🛣️', Energy: '⚡', 'Water & Sanitation': '💧', 'Social & Commercial': '🏥', Communication: '📡', Others: '🏭' }
export const iconOf = s => icons[s] || '🏗️'

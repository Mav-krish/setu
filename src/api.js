const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
export async function api(path, { method = 'GET', body } = {}) {
  const token = JSON.parse(localStorage.getItem('setu_user') || '{}').token
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data = text
  try { data = JSON.parse(text) } catch {}
  if (!res.ok) throw new Error((data && data.message) || (typeof data === 'string' && data) || `Request failed (${res.status})`)
  return data
}
// Fixed lists live in the frontend; the backend needs a row to reference. Find it by name or create it.
export async function ensureId(kind, name) {
  const key = kind === 'ministries' ? 'ministryId' : 'sectorId'
  const rows = await api('/api/' + kind)
  const hit = rows.find(r => r.name === name)
  if (hit) return hit[key]
  return (await api('/api/' + kind, { method: 'POST', body: { name } }))[key]
}

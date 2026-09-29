import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { useProjects } from '../hooks'
import { riskOf } from '../util'
// Accepts both the model's raw shape ({predictions, project_data}) from /generate and the stored DTO from /latest.
const norm = r => r.predictions
  ? { level: r.predictions.overall_risk_tier, overrun: r.predictions.predicted_overrun_pct * 100, delay: r.predictions.predicted_delay_days, cost: r.predictions.cost_risk_tier, time: r.predictions.time_risk_tier, data: r.project_data }
  : { level: r.riskLevel, overrun: (r.predictedOverrunPct || 0) * 100, delay: r.predictedDelayDays, cost: r.costRiskLevel, time: r.timeRiskLevel, factors: r.contributingFactors, at: r.generatedAt }
const up = s => String(s || '–').toUpperCase()
const label = k => k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
// Pick a handful of readable fields from project_data to show as extra context, skip ids/internal keys.
const SKIP = new Set(['project_name', 'agency', 'status'])
function extras(data) {
  if (!data || typeof data !== 'object') return []
  return Object.entries(data).filter(([k, v]) => !SKIP.has(k) && v !== null && v !== undefined && typeof v !== 'object').slice(0, 6)
    .map(([k, v]) => [label(k), typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : String(v)])
}
export default function Prediction() {
  const { all } = useProjects(); const [sp] = useSearchParams(); const [id, setId] = useState(sp.get('pid') || '')
  const [r, setR] = useState(null); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const p = all.find(x => x.id === id)
  useEffect(() => { setR(null); setErr(''); if (p?.real) api(`/api/projects/${p.rid}/risk/latest`).then(d => setR(norm(d))).catch(() => {})
    else if (p) { const k = riskOf(p); setR({ level: k.level, overrun: k.overrun, delay: { ON_TRACK: 0, COMPLETED: 0, DELAYED: 180, AT_RISK: 320, STALLED: 540 }[p.status], cost: k.level, time: p.status === 'ON_TRACK' ? 'LOW' : k.level,
      data: { sector: p.sector, ministry: p.ministry, implementing_agency: p.agency, original_cost_cr: p.original, cumulative_expenditure: p.spent, physical_progress: p.progress } }) } }, [id, all.length])
  async function gen() { setErr(''); setBusy(true); try { setR(norm(await api(`/api/projects/${p.rid}/risk/generate`, { method: 'POST' }))) } catch (x) { setErr(x.message) } finally { setBusy(false) } }
  const ex = r ? extras(r.data) : []
  return (<><h2>Risk prediction</h2><div className="panel row"><select value={id} onChange={e => setId(e.target.value)}><option value="">Select a project</option>{all.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
    {p?.real && <button className="btn" disabled={busy} onClick={gen}>{busy ? 'Predicting…' : 'Generate prediction'}</button>}</div>
    {err && <div className="err">{err}</div>}
    {r && <><div className="kpis"><div className="kpi"><b><span className={'tag ' + up(r.level)}>{up(r.level)}</span></b><span>Overall risk</span></div><div className="kpi"><b>{r.overrun.toFixed(1)}%</b><span>Predicted cost overrun</span></div>
      <div className="kpi"><b>{Math.round(r.delay || 0)} days</b><span>Predicted delay</span></div><div className="kpi"><b><span className={'tag ' + up(r.cost)}>{up(r.cost)}</span> <span className={'tag ' + up(r.time)}>{up(r.time)}</span></b><span>Cost / time risk</span></div></div>
      {r.factors && <div className="panel"><h3>Contributing factors</h3><p>{r.factors}</p>{r.at && <small>Generated {new Date(r.at).toLocaleString()}</small>}</div>}
      {!!ex.length && <div className="panel"><h3>Project snapshot used for this prediction</h3><div className="kgrid plain">{ex.map(([k, v]) => <div key={k}><div><small>{k}</small><b>{v}</b></div></div>)}</div></div>}</>}
    {!r && p?.real && <p className="empty">No prediction yet. Click “Generate prediction”.</p>}</>)
}

import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useProjects } from '../hooks'
import { useAuth } from '../auth.jsx'
import { api, ensureId } from '../api'
import { MINISTRIES, SECTORS, STATE_NAME } from '../data'
import { ProjectCard } from '../components.jsx'
import { inr, fmtDate, riskOf, STATUS } from '../util'
const FILTERS = [['all', 'All projects'], ['ON_TRACK', 'On track'], ['AT_RISK', 'At-risk projects'], ['DELAYED', 'Delayed projects'], ['COMPLETED', 'Completed'], ['STALLED', 'Stalled']]

export function ProjectDetail() {
  const { id } = useParams(); const { all } = useProjects(); const p = all.find(x => x.id === id)
  if (!p) return <p className="empty">Loading project…</p>
  const r = riskOf(p), q = p.real ? `pid=${id}` : `pid=${id}`
  return (<><p><Link to="/app/projects">← All projects</Link></p><h2>{p.name}</h2>
    <div className="detail"><ProjectCard p={p}/><div className="panel"><h3>Project details</h3><table><tbody>
      <tr><th>Ministry</th><td>{p.ministry}</td></tr><tr><th>Implementing agency</th><td>{p.agency}</td></tr>{p.state && <tr><th>State</th><td>{STATE_NAME[p.state]}</td></tr>}
      <tr><th>Status</th><td><span className={'tag ' + p.status}>{STATUS[p.status]}</span></td></tr><tr><th>Cumulative expenditure</th><td>{inr(p.spent)} Cr</td></tr>
      <tr><th>Cost overrun</th><td>{r.overrun.toFixed(1)}%</td></tr><tr><th>Completion</th><td>{fmtDate(p.endDate)}</td></tr></tbody></table>
      <div className="progress"><i style={{ width: Math.min(100, p.progress) + '%' }}/></div><small>{p.progress}% physical progress</small>
      <div className="row actions"><Link className="btn" to={`/app/prediction?${q}`}>Risk prediction</Link><Link className="btn ghost" to={`/app/chatbot?${q}`}>Ask AI</Link><Link className="btn ghost" to={`/app/mitigation?project=${encodeURIComponent(p.name)}`}>Mitigation</Link></div></div></div></>)
}

const empty = { name: '', ministry: '', sector: '', agency: '', original: '', revised: '', spent: '', progress: '', start: '', end: '' }
export default function Projects() {
  const { user } = useAuth(); const { all, reload, err: loadErr } = useProjects(); const [sp] = useSearchParams()
  const filter = sp.get('filter') || 'all', state = sp.get('state'), sector = sp.get('sector')
  const [q, setQ] = useState(''); const [show, setShow] = useState(false); const [f, setF] = useState({ ...empty, ministry: user.ministryName || '' }); const [err, setErr] = useState(''); const [ok, setOk] = useState('')
  const rows = all.filter(p => (filter === 'all' || p.status === filter) && (!state || p.state === state) && (!sector || p.sector === sector) && (!q || p.name.toLowerCase().includes(q.toLowerCase())))
  const set = k => e => setF({ ...f, [k]: e.target.value }); const num = v => v === '' ? null : Number(v)
  const title = (FILTERS.find(x => x[0] === filter)?.[1] || 'Projects') + (state ? ` – ${STATE_NAME[state]}` : '') + (sector ? ` – ${sector}` : '')
  async function add(e) {
    e.preventDefault(); setErr(''); setOk('')
    try {
      const [ministryId, sectorId] = await Promise.all([f.ministry ? ensureId('ministries', f.ministry) : null, f.sector ? ensureId('sectors', f.sector) : null])
      await api('/api/projects', { method: 'POST', body: { name: f.name, ministryId, sectorId, implementingAgency: f.agency, approvedCost: num(f.original), revisedCost: num(f.revised), cumulativeExpenditure: num(f.spent),
        physicalProgressPercent: num(f.progress), startDate: f.start || null, scheduledEndDate: f.end || null } })
      setF({ ...empty, ministry: user.ministryName || '' }); setShow(false); setOk('Project saved.'); reload()
    } catch (x) { setErr(x.message) }
  }
  return (<><div className="bar"><h2>{title}</h2><button className="btn" onClick={() => setShow(!show)}>{show ? 'Close' : '+ Add project'}</button></div>
    <div className="chips">{FILTERS.map(([k, l]) => <Link key={k} className={filter === k ? 'on' : ''} to={`/app/projects?filter=${k}`}>{l}</Link>)}</div>
    {(err || loadErr) && <div className="err">{err || loadErr}</div>}{ok && <div className="okmsg">{ok}</div>}
    {show && <form className="panel form" onSubmit={add}>
      <label>Project name<input required value={f.name} onChange={set('name')}/></label>
      <label>Ministry / department<select required value={f.ministry} onChange={set('ministry')}><option value="">Select</option>{MINISTRIES.map(m => <option key={m.short}>{m.name}</option>)}</select></label>
      <label>Sector<select required value={f.sector} onChange={set('sector')}><option value="">Select</option>{SECTORS.map(s => <option key={s}>{s}</option>)}</select></label>
      <label>Implementing agency<input value={f.agency} onChange={set('agency')}/></label>
      <label>Original cost (₹ Cr)<input required type="number" step="any" value={f.original} onChange={set('original')}/></label>
      <label>Latest revised cost (₹ Cr)<input type="number" step="any" value={f.revised} onChange={set('revised')}/></label>
      <label>Expenditure so far (₹ Cr)<input type="number" step="any" value={f.spent} onChange={set('spent')}/></label>
      <label>Physical progress (%)<input type="number" step="any" value={f.progress} onChange={set('progress')}/></label>
      <label>Start date<input type="date" value={f.start} onChange={set('start')}/></label>
      <label>Scheduled end date<input type="date" value={f.end} onChange={set('end')}/></label>
      <button className="btn">Save project</button></form>}
    <div className="panel"><input className="search" placeholder="Search projects" value={q} onChange={e => setQ(e.target.value)}/>
      <table><thead><tr><th>Project</th><th>Ministry</th><th>Original (₹ Cr)</th><th>Revised (₹ Cr)</th><th>Progress</th><th>Status</th></tr></thead><tbody>
        {rows.map(p => <tr key={p.id}><td><Link to={`/app/projects/${p.id}`}>{p.name}</Link>{p.real && <span className="live">saved</span>}</td><td>{p.ministry}</td><td>{p.original.toLocaleString('en-IN')}</td><td>{p.revised.toLocaleString('en-IN')}</td>
          <td><div className="progress sm"><i style={{ width: Math.min(100, p.progress) + '%' }}/></div>{p.progress}%</td><td><span className={'tag ' + p.status}>{STATUS[p.status]}</span></td></tr>)}
        {!rows.length && <tr><td colSpan="6" className="empty">No projects match this view.</td></tr>}</tbody></table></div></>)
}

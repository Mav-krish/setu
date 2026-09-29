import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useProjects } from '../hooks'
import { inr, riskOf, STATUS } from '../util'
import { SECTORS, MINISTRIES, STATE_NAME } from '../data'
const C = ['#1a2f5a', '#e07b00', '#1e7a34', '#7b3fa0', '#00838f', '#8d6e63']
const RADIAN = Math.PI / 180
const sliceLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.04) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + r * Math.cos(-midAngle * RADIAN), y = cy + r * Math.sin(-midAngle * RADIAN)
  return <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,.45)', strokeWidth: 3 }}>{Math.round(percent * 100)}%</text>
}
export default function Dashboard() {
  const { all, scope } = useProjects(); const nav = useNavigate()
  const n = s => all.filter(p => p.status === s).length; const sum = k => all.reduce((a, p) => a + (p[k] || 0), 0)
  const short = name => MINISTRIES.find(m => m.name === name)?.short || name
  const sector = SECTORS.map(s => ({ name: s, value: all.filter(p => p.sector === s).length })).filter(d => d.value)
  const byMin = [...new Set(all.map(p => p.ministry))].map(m => { const ps = all.filter(p => p.ministry === m)
    return { name: short(m), 'On track': ps.filter(p => p.status === 'ON_TRACK').length, Delayed: ps.filter(p => p.status === 'DELAYED').length, 'At risk': ps.filter(p => p.status === 'AT_RISK').length, Stalled: ps.filter(p => p.status === 'STALLED').length, Completed: ps.filter(p => p.status === 'COMPLETED').length,
      Original: Math.round(ps.reduce((a, p) => a + p.original, 0)), Revised: Math.round(ps.reduce((a, p) => a + p.revised, 0)) } })
  const top = [...all].map(p => ({ ...p, r: riskOf(p) })).sort((a, b) => b.r.score - a.r.score).slice(0, 6)
  const tiles = [['All projects', all.length, 'all'], ['At risk', n('AT_RISK'), 'AT_RISK'], ['Delayed', n('DELAYED'), 'DELAYED'], ['Completed', n('COMPLETED'), 'COMPLETED']]
  const states = [...new Set(all.map(p => p.state).filter(Boolean))].sort((a, b) => (STATE_NAME[a] || a).localeCompare(STATE_NAME[b] || b))
  const [state, setState] = useState(states[0] || '')
  const stateRows = all.filter(p => p.state === state)
  return (<><h2>Dashboard</h2>{scope && <p className="note">{scope}</p>}
    <div className="kpis">{tiles.map(([l, v, f]) => <Link key={l} to={`/app/projects?filter=${f}`} className={'kpi link ' + f}><b>{v}</b><span>{l}</span></Link>)}
      <div className="kpi"><b>{inr(sum('revised'))}</b><span>Latest revised cost (Cr)</span></div><div className="kpi"><b>{inr(sum('spent'))}</b><span>Cumulative expenditure (Cr)</span></div></div>
    <div className="grid">
      <div className="panel"><h3>Sector-wise projects</h3><ResponsiveContainer height={260}><PieChart><Pie data={sector} dataKey="value" nameKey="name" outerRadius={95} labelLine={false} label={sliceLabel} onClick={d => nav('/app/projects?sector=' + encodeURIComponent(d.name))}>{sector.map((_, i) => <Cell key={i} fill={C[i % 6]}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div>
      <div className="panel"><h3>Project status by ministry</h3><ResponsiveContainer height={260}><BarChart data={byMin}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" fontSize={11}/><YAxis fontSize={11} allowDecimals={false}/><Tooltip/><Legend/>
        <Bar dataKey="On track" stackId="a" fill="#1e7a34"/><Bar dataKey="Completed" stackId="a" fill="#1a2f5a"/><Bar dataKey="Delayed" stackId="a" fill="#e07b00"/><Bar dataKey="At risk" stackId="a" fill="#c62828"/><Bar dataKey="Stalled" stackId="a" fill="#6d4c41"/></BarChart></ResponsiveContainer></div>
      <div className="panel"><h3>Original vs revised cost (₹ Cr)</h3><ResponsiveContainer height={260}><BarChart data={byMin}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" fontSize={11}/><YAxis fontSize={11}/><Tooltip/><Legend/><Bar dataKey="Original" fill="#1a2f5a"/><Bar dataKey="Revised" fill="#e07b00"/></BarChart></ResponsiveContainer></div>
      <div className="panel"><h3>State-wise projects</h3><select value={state} onChange={e => setState(e.target.value)}>{states.map(s => <option key={s} value={s}>{STATE_NAME[s] || s}</option>)}</select>
        <table><thead><tr><th>Project</th><th>Ministry</th><th>Status</th></tr></thead><tbody>
          {stateRows.map(p => <tr key={p.id}><td><Link to={`/app/projects/${p.id}`}>{p.name}</Link></td><td>{short(p.ministry)}</td><td><span className={'tag ' + p.status}>{STATUS[p.status]}</span></td></tr>)}
          {!stateRows.length && <tr><td colSpan="3" className="empty">No projects recorded for this state yet.</td></tr>}</tbody></table></div></div>
    <div className="panel"><h3>Top risk projects</h3><table><thead><tr><th>Project</th><th>Ministry</th><th>Status</th><th>Risk</th><th>Score</th><th>Cost overrun</th></tr></thead><tbody>
      {top.map(p => <tr key={p.id}><td><Link to={`/app/projects/${p.id}`}>{p.name}</Link></td><td>{short(p.ministry)}</td><td><span className={'tag ' + p.status}>{STATUS[p.status]}</span></td><td><span className={'tag ' + p.r.level}>{p.r.level}</span></td><td>{p.r.score}</td><td>{p.r.overrun.toFixed(1)}%</td></tr>)}</tbody></table></div></>)
}

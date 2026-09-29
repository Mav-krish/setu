import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { inr, fmtDate, iconOf } from './util'
import { TILES, stateCounts, MINISTRIES, SECTORS, aggregate } from './data'

export const Brand = ({ small }) => (
  <div className={'brandbar' + (small ? ' small' : '')}>
    <img src="/emblem.svg" alt="Emblem of India" className="emb"/>
    <div className="mospi"><b>Ministry of Statistics and Programme Implementation</b><span>Government of India</span></div>
    <i className="vsep"/>
    <div className="setu"><h1>SETU</h1><span>National Infrastructure Risk Monitoring &amp; Management System</span></div>
  </div>)

export function Footer() {
  return (<footer className="foot">
    <div className="footin">
      <div><Brand small/></div>
      <h4>Get in touch</h4>
      <p>Ministry of Statistics and Programme Implementation, Government of India, Khurshid Lal Bhawan, Janpath, New Delhi-110001 (India).</p>
      <p>✉ helpdesk@setu.example</p>
      <nav>{[['Home', '/'], ['Contact Us', '/info/contact'], ['FAQs', '/info/faqs'], ['Site Map', '/info/sitemap'], ['Hyperlinking Policy', '/info/hyperlinking'], ['Privacy Policy', '/info/privacy']].map(([l, h]) => <Link key={l} to={h}>{l}</Link>)}</nav>
      <p className="own"><b>Content owned and maintained by:</b> Infrastructure &amp; Project Monitoring Division (IPMD) | Ministry of Statistics and Programme Implementation.</p>
      <p className="own">Copyright © 2026 Ministry of Statistics and Programme Implementation</p>
    </div></footer>)
}

export function ProjectCard({ p, to }) {
  const body = (<>
    <div className="ico">{iconOf(p.sector)}</div><h4>{p.sector}</h4>
    <div className="agency">{p.agency}</div><div className="pname" title={p.name}>{p.name}</div>
    <div className="grid4"><div><small>Original Cost (in Cr)</small><b>{inr(p.original)}</b></div><div><small>Physical Progress (in %)</small><b>{p.progress}</b></div>
      <div><small>Latest Revised Cost (in Cr)</small><b>{inr(p.revised)}</b></div><div><small>Latest Revised Comp. Date</small><b>{fmtDate(p.endDate)}</b></div></div></>)
  return to ? <Link to={to} className="pcardx">{body}</Link> : <div className="pcardx">{body}</div>
}

export function Marquee({ items }) {
  const list = [...items, ...items]
  return (<div className="marq"><div className="track">{list.map((p, i) => <ProjectCard key={i} p={p}/>)}</div></div>)
}

const scale = t => { const a = [255, 251, 204], b = [198, 40, 40]; return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})` }
export function TileMap({ onPick }) {
  const counts = stateCounts(), max = Math.max(...Object.values(counts))
  return (<div className="tilemap"><div className="tiles">
    {TILES.map(([c, name, x, y]) => (
      <button key={c} className="tile" title={`${name}: ${counts[c]} projects`} onClick={() => onPick && onPick(c)}
        style={{ gridColumn: x + 1, gridRow: y + 1, background: scale(counts[c] / max) }}><b>{c}</b><small>{counts[c]}</small></button>))}
  </div>
    <div className="legend"><span>{max}</span><i/><span>0</span></div></div>)
}

export function MinistrySectorPanel({ allProjects }) {
  const [mode, setMode] = useState('ministry')
  const names = mode === 'ministry' ? MINISTRIES.map(m => m.name) : SECTORS
  const [sel, setSel] = useState(names[0])
  const active = (mode === 'ministry' ? MINISTRIES.map(m => m.name) : SECTORS).includes(sel) ? sel : names[0]
  const rows = allProjects.filter(p => (mode === 'ministry' ? p.ministry : p.sector) === active)
  const k = aggregate(rows)
  const short = n => MINISTRIES.find(m => m.name === n)?.short || n
  const tiles = [['Project Count (No.)', k.count, '📑'], ['Original Cost (in Cr)', inr(k.original), '🪙'], ['Latest Revised Cost (in Cr)', inr(k.revised), '💰'],
    ['Expenditure (Cumm.) (in Cr)', inr(k.spent), '📊'], ['Completed During Month (No.)', k.completed, '✅'], ['Newly Added (No.)', k.newly, '🏗️']]
  return (<div className="mspanel">
    <div className="mstoggle"><button className={mode === 'ministry' ? 'on' : ''} onClick={() => setMode('ministry')}>Ministry-Wise</button><button className={mode === 'sector' ? 'on' : ''} onClick={() => setMode('sector')}>Sector-Wise</button></div>
    <div className="msbody"><div className="mslist">{names.map(n => <button key={n} className={active === n ? 'on' : ''} onClick={() => setSel(n)}>{mode === 'ministry' ? short(n) : n}</button>)}</div>
      <div className="mskpi"><div className="pill">{active} <small>(as of August, 2026)</small></div>
        <div className="kgrid">{tiles.map(t => <div key={t[0]}><span className="kico">{t[2]}</span><div><small>{t[0]}</small><b>{t[1]}</b></div></div>)}</div></div></div></div>)
}

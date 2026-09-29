import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { MINISTRIES, SECTORS, SEED } from '../data'
import { iconOf } from '../util'
export default function Directory({ kind }) {
  const min = kind === 'ministries'; const [extra, setExtra] = useState([]); const [name, setName] = useState(''); const [dep, setDep] = useState(''); const [err, setErr] = useState(''); const [q, setQ] = useState('')
  const fixed = min ? MINISTRIES.map(m => m.name) : SECTORS
  const load = () => api('/api/' + kind).then(d => setExtra(d.filter(x => !fixed.includes(x.name)))).catch(e => setErr(e.message)); useEffect(() => { load() }, [kind])
  async function add(e) { e.preventDefault(); setErr(''); try { await api('/api/' + kind, { method: 'POST', body: min ? { name, department: dep } : { name } }); setName(''); setDep(''); load() } catch (x) { setErr(x.message) } }
  const list = (min ? MINISTRIES : SECTORS.map(s => ({ name: s, sector: s }))).filter(m => m.name.toLowerCase().includes(q.toLowerCase()))
  return (<><h2>{min ? 'Ministries & Departments' : 'Sectors'}</h2><p className="note">{min ? 'Ministries and departments whose projects are monitored on the portal.' : 'Infrastructure sectors used to classify projects.'}</p>
    <input className="search wide" placeholder={min ? 'Search ministries' : 'Search sectors'} value={q} onChange={e => setQ(e.target.value)}/>
    <div className="dir">{list.map(m => (<div className="panel dcard" key={m.name}><h3>{min ? '🏛️ ' : iconOf(m.name) + ' '}{m.name}</h3>
      {min ? (<><p className="note">Sector: {m.sector}</p><p><b>{m.count.toLocaleString('en-IN')}</b> projects · ₹ {m.cost} lakh crore</p><p>📍 {m.addr}</p>
        <p>🌐 <a href={'https://' + m.site} target="_blank" rel="noreferrer">{m.site}</a></p><p>✉ {m.email}</p><Link to={`/app/projects?ministry=${encodeURIComponent(m.name)}`}>View projects</Link></>)
        : <p><b>{SEED.filter(p => p.sector === m.name).length}</b> projects on the portfolio · <Link to={`/app/projects?sector=${encodeURIComponent(m.name)}`}>View projects</Link></p>}</div>))}
      {extra.map(x => <div className="panel dcard" key={x.ministryId || x.sectorId}><h3>{x.name}</h3><p className="note">{x.department || 'Added by user'}</p><span className="live">saved</span></div>)}</div>
    <h3>Add {min ? 'a ministry' : 'a sector'}</h3>{err && <div className="err">{err}</div>}
    <form className="panel row" onSubmit={add}><input required placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>{min && <input placeholder="Department" value={dep} onChange={e => setDep(e.target.value)}/>}<button className="btn">Add</button></form></>)
}

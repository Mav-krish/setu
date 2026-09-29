import { useState } from 'react'
import { MINISTRIES, SEED } from '../data'
const U = [['Anita Sharma', 'Ministry Official', MINISTRIES[0].short, 'Active'], ['R. Venkatesh', 'Ministry Official', MINISTRIES[1].short, 'Pending'], ['Imran Khan', 'Field Engineer', MINISTRIES[4].short, 'Active'], ['Pooja Deshmukh', 'Field Engineer', MINISTRIES[3].short, 'Pending'], ['Suresh Patel', 'Ministry Official', MINISTRIES[6].short, 'Pending']]
export default function Admin() {
  const [users, setUsers] = useState(U); const [asg, setAsg] = useState([]); const [eng, setEng] = useState(''); const [pr, setPr] = useState('')
  const engs = users.filter(u => u[1] === 'Field Engineer' && u[3] === 'Active')
  return (<><h2>Overview</h2><div className="kpis"><div className="kpi"><b>{users.length}</b><span>Users</span></div><div className="kpi"><b>{users.filter(u => u[3] === 'Pending').length}</b><span>Pending approvals</span></div><div className="kpi"><b>{SEED.length}</b><span>Projects</span></div><div className="kpi"><b>{asg.length}</b><span>Engineer assignments</span></div></div>
    <div className="panel"><h3>Users</h3><table><thead><tr><th>Name</th><th>Role</th><th>Ministry</th><th>Status</th><th/></tr></thead><tbody>
      {users.map((u, i) => <tr key={u[0]}><td>{u[0]}</td><td>{u[1]}</td><td>{u[2]}</td><td><span className={'tag ' + (u[3] === 'Active' ? 'ON_TRACK' : 'DELAYED')}>{u[3]}</span></td>
        <td>{u[3] === 'Pending' && <button className="btn ghost" onClick={() => setUsers(users.map((x, j) => j === i ? [...x.slice(0, 3), 'Active'] : x))}>Approve</button>}</td></tr>)}</tbody></table></div>
    <div className="panel"><h3>Assign engineer to project</h3><div className="row"><select value={eng} onChange={e => setEng(e.target.value)}><option value="">Engineer</option>{engs.map(u => <option key={u[0]}>{u[0]}</option>)}</select>
      <select value={pr} onChange={e => setPr(e.target.value)}><option value="">Project</option>{SEED.map(s => <option key={s.id}>{s.name}</option>)}</select>
      <button className="btn" disabled={!eng || !pr} onClick={() => { setAsg([...asg, [eng, pr]]); setEng(''); setPr('') }}>Assign</button></div>
      <ul>{asg.map((a, i) => <li key={i}>{a[0]} → {a[1]}</li>)}</ul></div></>)
}

import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { Brand, Footer } from '../components.jsx'
const NAV = {
  ministry: [['', 'Dashboard'], ['projects', 'Projects'], ['sectors', 'Sectors'], ['ministries', 'Ministries'], ['prediction', 'Prediction'], ['chatbot', 'AI Assistant'], ['mitigation', 'Mitigation']],
  engineer: [['', 'Field Submission']],
  admin: [['', 'Overview'], ['projects', 'Projects'], ['ministries', 'Ministries'], ['sectors', 'Sectors']],
}
const TOP = { ministry: [['projects', 'Projects'], ['mitigation', 'Mitigation'], ['chatbot', 'AI Assistant']], engineer: [], admin: [] }
export default function Layout() {
  const { user, logout } = useAuth(); const nav = useNavigate(); const items = NAV[user.portal]; const top = TOP[user.portal]
  const sub = user.portal === 'ministry' ? (user.ministryName || 'Ministry') : user.portal === 'engineer' ? 'Field Engineer' : 'Administrator'
  return (<div className="shell"><div className="tri"><i/><i/><i/></div>
    <header className="top"><Brand small/><nav>{top.map(([p, l]) => <NavLink key={p} to={`/app/${p}`}>{l}</NavLink>)}</nav>
      <div className="who">{user.name}<small>{sub}</small></div></header>
    <div className="body"><aside>{items.map(([p, l]) => <NavLink key={p} end={p === ''} to={`/app/${p}`}>{l}</NavLink>)}
      <a href="#" className="out" onClick={e => { e.preventDefault(); logout(); nav('/') }}>Log out</a></aside>
      <main><Outlet/></main></div><Footer/></div>)
}

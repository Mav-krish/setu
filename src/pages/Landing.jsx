import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { MINISTRIES, SEED, HERO_IMAGES } from '../data'
import { Brand, Footer, Marquee, MinistrySectorPanel } from '../components.jsx'

const ROLES = [['ministry', 'Ministry Official'], ['engineer', 'Field Engineer'], ['admin', 'Administrator']]
function LoginCard() {
  const { ministryLogin, ministryRegister, placeholderLogin } = useAuth(); const nav = useNavigate()
  const [role, setRole] = useState('ministry'); const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '', ministryName: '' }); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value }); const reg = mode === 'register' && role === 'ministry'
  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true)
    try {
      if (role === 'ministry') await (reg ? ministryRegister(f) : ministryLogin(f)); else placeholderLogin(role, f)
      nav('/app')
    } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (<form className="logincard" onSubmit={submit}>
    <div className="roles">{ROLES.map(([k, l]) => <button type="button" key={k} className={role === k ? 'on' : ''} onClick={() => { setRole(k); setMode('login') }}>{l}</button>)}</div>
    <h3>{reg ? 'Register' : 'Sign in'}</h3>
    {reg && <label>Full name<input required value={f.name} onChange={set('name')}/></label>}
    <label>Email<input required type={role === 'ministry' ? 'email' : 'text'} value={f.email} onChange={set('email')}/></label>
    <label>Password<input required type="password" value={f.password} onChange={set('password')}/></label>
    {role === 'ministry' && <label>Ministry / department<select required={reg} value={f.ministryName} onChange={set('ministryName')}>
      <option value="">Select</option>{MINISTRIES.map(m => <option key={m.short}>{m.name}</option>)}</select></label>}
    {err && <div className="err">{err}</div>}
    <button className="btn" disabled={busy}>{busy ? 'Please wait…' : reg ? 'Create account' : 'Log in'}</button>
    {role === 'ministry' ? <p className="alt">{mode === 'login' ? 'New official?' : 'Have an account?'} <a href="#" onClick={e => { e.preventDefault(); setMode(mode === 'login' ? 'register' : 'login') }}>{mode === 'login' ? 'Register' : 'Log in'}</a></p>
      : <p className="alt">Accounts for this role are issued by the administrator.</p>}
  </form>)
}

export default function Landing() {
  const nav = useNavigate(); const { user } = useAuth(); const [slide, setSlide] = useState(0)
  useEffect(() => { if (user) nav('/app', { replace: true }) }, [])
  useEffect(() => { const t = setInterval(() => setSlide(s => (s + 1) % HERO_IMAGES.length), 5000); return () => clearInterval(t) }, [])
  const hv = [...SEED].sort((a, b) => b.original - a.original).slice(0, 10)
  return (<div className="pub"><div className="tri"><i/><i/><i/></div>
    <header className="pubhead"><Brand/><nav><Link to="/info/about">About</Link><Link to="/info/faqs">FAQs</Link><Link to="/info/contact">Contact</Link></nav></header>
    <section className="hero">
      {HERO_IMAGES.map((src, i) => <div key={src} className={'slide' + (i === slide ? ' on' : '')} style={{ backgroundImage: `url(${src})` }}/>)}
      <div className="heroshade"/>
      <div className="herotxt"><h2>Monitoring India's Infrastructure — Before Delays Happen</h2>
        <p>Central Sector projects, tracked end to end: real-time status, predicted cost and schedule risk, ground reports from the field, and mitigation planning, all in one portal.</p>
        <div className="stats"><div><b>1,731</b><span>Projects monitored</span></div><div><b>17</b><span>Ministries &amp; departments</span></div><div><b>₹ 33.6 L Cr</b><span>Revised cost</span></div></div></div>
      <LoginCard/></section>
    <section className="sec"><h2>High Value Projects</h2><Marquee items={hv}/></section>
    <section className="sec"><h2>Projects by Ministry &amp; Sector</h2><MinistrySectorPanel allProjects={SEED}/></section>
    <Footer/></div>)
}

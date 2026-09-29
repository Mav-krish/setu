import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { useProjects } from '../hooks'
const mapKey = 'setu_chat_project_map' // { [sessionId]: projectId } — used only to tag which project a NEW session started from
const loadMap = () => JSON.parse(localStorage.getItem(mapKey) || '{}')
const saveMap = m => localStorage.setItem(mapKey, JSON.stringify(m))
export default function Chatbot() {
  const { all } = useProjects(); const [sp] = useSearchParams()
  const rawPid = sp.get('pid') || ''; const initialPid = rawPid.startsWith('r-') ? rawPid.slice(2) : ''
  const [pid, setPid] = useState(initialPid); const [sessions, setSessions] = useState([]); const [map, setMap] = useState(loadMap())
  const [sid, setSid] = useState(null); const [msgs, setMsgs] = useState([]); const [q, setQ] = useState(''); const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  const end = useRef(); const projects = all.filter(p => p.real)
  const loadSessions = () => api('/api/chatbot/sessions').then(d => setSessions([...d].sort((a, b) => a - b))).catch(e => setErr(e.message)); useEffect(() => { loadSessions() }, [])
  useEffect(() => { if (sid) api(`/api/chatbot/sessions/${sid}/messages`).then(setMsgs).catch(e => setErr(e.message)) }, [sid])
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])
  async function send(e) {
    e.preventDefault(); if (!q.trim() || !pid) return; const text = q; setQ(''); setErr(''); setBusy(true)
    setMsgs(m => [...m, { sender: 'USER', content: text }])
    try {
      const r = await api('/api/chatbot/query', { method: 'POST', body: { sessionId: sid, projectId: sid ? null : Number(pid), question: text } })
      setMsgs(m => [...m, { sender: 'BOT', content: r.answer }])
      if (!sid) { const nm = { ...map, [r.sessionId]: pid }; setMap(nm); saveMap(nm); setSid(r.sessionId); loadSessions() }
    } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (<><h2>AI assistant</h2>
    <div className="panel row"><label style={{ flex: 1 }}>Project (for new sessions)<select value={pid} onChange={e => { setPid(e.target.value); setSid(null); setMsgs([]) }}>
      <option value="">Select a project</option>{projects.map(p => <option key={p.rid} value={p.rid}>{p.name}</option>)}</select></label></div>
    <div className="chat"><div className="sess"><button className="btn ghost" disabled={!pid} onClick={() => { setSid(null); setMsgs([]) }}>+ New session</button>
      {sessions.map(s => <a key={s} href="#" className={s === sid ? 'on' : ''} onClick={e => { e.preventDefault(); setSid(s) }}>Session {s}{map[s] && <small> · {all.find(p => p.rid == map[s])?.name || ''}</small>}</a>)}
      {!sessions.length && <p className="note">No sessions yet.</p>}</div>
      <div className="conv"><div className="msgs">{!sid && !msgs.length && <p className="empty">{pid ? 'Pick a session on the left, or start a new one.' : 'Select a project above to start a new session, or open an existing one on the left.'}</p>}
        {msgs.map((m, i) => <div key={i} className={'msg ' + m.sender}>{m.content}</div>)}{busy && <div className="msg BOT">Thinking…</div>}<div ref={end}/></div>
        {err && <div className="err">{err}</div>}
        <form className="row" onSubmit={send}><input value={q} onChange={e => setQ(e.target.value)} placeholder={pid || sid ? 'Type your question' : 'Select a project first'} disabled={!pid && !sid}/><button className="btn" disabled={busy || (!pid && !sid)}>Send</button></form></div></div></>)
}

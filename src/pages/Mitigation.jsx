import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { useProjects } from '../hooks'
export default function Mitigation() {
  const [sp] = useSearchParams(); const { all } = useProjects(); const [name, setName] = useState(sp.get('project') || ''); const [sid, setSid] = useState('')
  const [hist, setHist] = useState([]); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const path = `/api/mitigation/${encodeURIComponent(name)}/${sid}/strategies`
  const loadH = () => api(path).then(setHist).catch(e => setErr(e.message))
  async function gen() { setErr(''); setBusy(true); try { await api('/api/mitigation/generate', { method: 'POST', body: { projectName: name, sessionId: Number(sid) } }); await loadH() } catch (x) { setErr(x.message) } finally { setBusy(false) } }
  return (<><h2>Mitigation</h2><p className="note">Mitigation plans are built from a ground engineer's questionnaire. Enter the project name and the session number the engineer received after submitting.</p>
    <div className="panel row"><input list="pn" placeholder="Project name (exact)" value={name} onChange={e => setName(e.target.value)}/><datalist id="pn">{all.map(x => <option key={x.id} value={x.name}/>)}</datalist><input style={{ maxWidth: 140 }} type="number" placeholder="Session no." value={sid} onChange={e => setSid(e.target.value)}/>
      <button className="btn" disabled={!name || !sid || busy} onClick={gen}>{busy ? 'Generating…' : 'Generate strategy'}</button>
      <button className="btn ghost" disabled={!name || !sid} onClick={loadH}>View history</button></div>
    {err && <div className="err">{err}</div>}
    {hist.map(h => <div className="panel" key={h.strategyId}><h3>Strategy #{h.strategyId}</h3><small>{new Date(h.generatedAt).toLocaleString()}</small><p style={{ whiteSpace: 'pre-wrap' }}>{h.mitigationStrategy}</p></div>)}</>)
}

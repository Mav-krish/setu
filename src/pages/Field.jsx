import { useRef, useState } from 'react'
import { api } from '../api'
import { SEED, STATE_NAME, QUESTIONNAIRE } from '../data'
export default function Field() {
  const [loc, setLoc] = useState(null); const [manual, setManual] = useState({ state: '', district: '' }); const [proj, setProj] = useState(''); const [tab, setTab] = useState('video'); const [msg, setMsg] = useState('')
  const [rec, setRec] = useState(false); const [clip, setClip] = useState(null); const [done, setDone] = useState(null); const [f, setF] = useState({}); const [err, setErr] = useState('')
  const vid = useRef(), mr = useRef(), chunks = useRef([])
  function locate() { setMsg('Locating…'); navigator.geolocation ? navigator.geolocation.getCurrentPosition(p => { setLoc({ lat: p.coords.latitude.toFixed(5), lng: p.coords.longitude.toFixed(5) }); setMsg('') }, () => setMsg('Location unavailable. Enter your state and district below.')) : setMsg('Location is not supported here. Enter your state and district below.') }
  async function start() {
    try { const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true }); vid.current.srcObject = s; vid.current.play()
      chunks.current = []; mr.current = new MediaRecorder(s); mr.current.ondataavailable = e => chunks.current.push(e.data)
      mr.current.onstop = () => { s.getTracks().forEach(t => t.stop()); vid.current.srcObject = null; setClip(URL.createObjectURL(new Blob(chunks.current, { type: 'video/webm' }))) }; mr.current.start(); setRec(true)
    } catch { setErr('Camera access was blocked. You can upload a video file instead.') }
  }
  const stop = () => { mr.current?.stop(); setRec(false) }
  const ready = loc || (manual.state && manual.district); const name = SEED.find(s => s.id === proj)?.name || proj
  function submitVideo() { setDone({ kind: 'Video', ref: 'VID-' + Date.now().toString().slice(-8) }); setClip(null) }
  async function submitQ(e) { e.preventDefault(); setErr(''); try { const r = await api('/api/mitigation/questionnaire', { method: 'POST', body: { projectName: name, ...f } }); setDone({ kind: 'Questionnaire', ref: 'Session ' + r.sessionId }) } catch (x) { setErr(x.message) } }
  const answered = QUESTIONNAIRE.every(([k]) => f[k])
  if (done) return <div className="panel"><h2>{done.kind} submitted</h2><p>Reference: <b>{done.ref}</b></p><button className="btn" onClick={() => { setDone(null); setF({}) }}>Submit another</button></div>
  return (<><h2>Field submission</h2>
    <div className="panel"><h3>1. Your location</h3>{loc ? <p>📍 {loc.lat}, {loc.lng}</p> : <div className="row"><button className="btn" onClick={locate}>Share my location</button><span className="note">or</span>
      <select value={manual.state} onChange={e => setManual({ ...manual, state: e.target.value })}><option value="">State</option>{Object.values(STATE_NAME).map(s => <option key={s}>{s}</option>)}</select>
      <input placeholder="District" value={manual.district} onChange={e => setManual({ ...manual, district: e.target.value })}/></div>}{msg && <p className="note">{msg}</p>}</div>
    {ready && <div className="panel"><h3>2. Project</h3><select value={proj} onChange={e => setProj(e.target.value)}><option value="">Select project</option>{SEED.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>}
    {ready && proj && <div className="panel"><div className="roles"><button className={tab === 'video' ? 'on' : ''} onClick={() => setTab('video')}>Geospatial video <span className="soon">Coming soon</span></button><button className={tab === 'q' ? 'on' : ''} onClick={() => setTab('q')}>Questionnaire</button></div>
      {err && <div className="err">{err}</div>}
      {tab === 'video' ? (<div><p className="note"><span className="soon">Coming soon</span> — recording and upload work below, but submissions are not stored yet.</p>
        <video ref={vid} muted playsInline className="vid" src={clip || undefined} controls={!!clip}/>
        <div className="row">{!rec ? <button className="btn" onClick={start}>● Record</button> : <button className="btn stop" onClick={stop}>■ Stop</button>}
          <label className="btn ghost">Upload video<input hidden type="file" accept="video/*" onChange={e => e.target.files[0] && setClip(URL.createObjectURL(e.target.files[0]))}/></label>
          <button className="btn" disabled={!clip} onClick={submitVideo}>Submit video</button></div><p className="note">Tagged with your location and the time of submission.</p></div>)
        : (<form className="form qform" onSubmit={submitQ}>{QUESTIONNAIRE.map(([k, q, w, opts]) => <label key={k}>{q} <small className="note">(weight {w})</small>
            <select required value={f[k] || ''} onChange={e => setF({ ...f, [k]: e.target.value })}><option value="">Select</option>{opts.map(o => <option key={o}>{o}</option>)}</select></label>)}
          <button className="btn" disabled={!answered}>Submit questionnaire</button></form>)}</div>}</>)
}

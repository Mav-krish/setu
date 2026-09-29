import { useEffect, useState, useCallback } from 'react'
import { api } from './api'
import { SEED } from './data'
import { useAuth } from './auth.jsx'
const mapReal = p => ({ id: 'r-' + p.projectId, real: true, rid: p.projectId, name: p.name, agency: p.implementingAgency || '–', ministry: p.ministryName || '–', sector: p.sectorName || '–',
  original: Number(p.approvedCost || 0), revised: Number(p.revisedCost || p.approvedCost || 0), progress: p.physicalProgressPercent ?? 0, endDate: p.revisedEndDate || p.scheduledEndDate,
  startDate: p.startDate, state: null, status: p.status, spent: Number(p.cumulativeExpenditure || 0) })
export function useProjects() {
  const { user } = useAuth(); const [real, setReal] = useState([]); const [err, setErr] = useState('')
  const load = useCallback(() => api('/api/projects').then(d => setReal(d.map(mapReal))).catch(e => setErr(e.message)), [])
  useEffect(() => { load() }, [load])
  const scope = user?.portal === 'ministry' && user.ministryName ? user.ministryName : null
  const all = [...real, ...SEED].filter(p => !scope || p.ministry === scope)
  return { all, reload: load, err, scope }
}

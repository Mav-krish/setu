// Ministries/departments monitored on PAIMANA (MoSPI flash reports). Counts and costs are approximate.
export const SECTORS = ['Transport & Logistics', 'Energy', 'Water & Sanitation', 'Social & Commercial', 'Communication', 'Others']
const M = (short, name, sector, count, cost, site, addr) => ({ short, name, sector, count, cost, site, addr, email: `nodal.paimana@${site.replace('https://', '')}` })
export const MINISTRIES = [
  M('MoRTH', 'Ministry of Road Transport & Highways', 'Transport & Logistics', 1149, 10.81, 'morth.nic.in', 'Transport Bhawan, 1 Parliament Street, New Delhi 110001'),
  M('Railways', 'Ministry of Railways', 'Transport & Logistics', 261, 8.69, 'indianrailways.gov.in', 'Rail Bhawan, Raisina Road, New Delhi 110001'),
  M('Coal', 'Ministry of Coal', 'Energy', 128, 2.49, 'coal.gov.in', 'Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001'),
  M('Petroleum', 'Ministry of Petroleum & Natural Gas', 'Energy', 112, 5.19, 'mopng.gov.in', 'Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001'),
  M('Power', 'Ministry of Power', 'Energy', 102, 5.53, 'powermin.gov.in', 'Shram Shakti Bhawan, Rafi Marg, New Delhi 110001'),
  M('MoHUA', 'Ministry of Housing & Urban Affairs', 'Water & Sanitation', 51, 3.75, 'mohua.gov.in', 'Nirman Bhawan, Maulana Azad Road, New Delhi 110011'),
  M('DoWR', 'Department of Water Resources, River Development & Ganga Rejuvenation', 'Water & Sanitation', 48, 2.25, 'jalshakti-dowr.gov.in', 'Shram Shakti Bhawan, Rafi Marg, New Delhi 110001'),
  M('Civil Aviation', 'Ministry of Civil Aviation', 'Transport & Logistics', 22, 0.6, 'civilaviation.gov.in', 'Rajiv Gandhi Bhawan, Safdarjung Airport, New Delhi 110003'),
  M('Telecom', 'Department of Telecommunications', 'Communication', 15, 0.5, 'dot.gov.in', 'Sanchar Bhawan, 20 Ashoka Road, New Delhi 110001'),
  M('Steel', 'Ministry of Steel', 'Others', 12, 0.4, 'steel.gov.in', 'Udyog Bhawan, Maulana Azad Road, New Delhi 110011'),
  M('Mines', 'Ministry of Mines', 'Others', 9, 0.2, 'mines.gov.in', 'Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001'),
  M('Ports', 'Ministry of Ports, Shipping and Waterways', 'Transport & Logistics', 25, 0.9, 'shipmin.gov.in', 'Transport Bhawan, 1 Parliament Street, New Delhi 110001'),
  M('Higher Education', 'Department of Higher Education', 'Social & Commercial', 18, 0.3, 'education.gov.in', 'Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001'),
  M('Health', 'Ministry of Health & Family Welfare', 'Social & Commercial', 14, 0.3, 'mohfw.gov.in', 'Nirman Bhawan, Maulana Azad Road, New Delhi 110011'),
  M('DPIIT', 'Department for Promotion of Industry and Internal Trade', 'Others', 20, 0.5, 'dpiit.gov.in', 'Udyog Bhawan, Maulana Azad Road, New Delhi 110011'),
]
export const ministryByShort = s => MINISTRIES.find(m => m.short === s)
// [ministry, name, agency, original ₹Cr, revised ₹Cr, progress %, completion, state, status]
// First four rows are from the PAIMANA landing page; the rest are representative entries.
const ROWS = [
  ['Power', 'Rajasthan Part I Power Transmission System', 'Adani Transmission Limited', 25000, 25000, 12, '2029-07-20', 'RJ', 'ON_TRACK'],
  ['DoWR', 'Ken-Betwa Link Project', 'Dept. of Water Resources, RD & GR', 21030, 21030, 0, '2029-03-31', 'MP', 'ON_TRACK'],
  ['Railways', 'Jiribam–Imphal New Line (110 km)', 'CAO/C-III/NFR', 14323, 21886, 78, '2029-06-30', 'MN', 'DELAYED'],
  ['Petroleum', 'Paradip–Numaligarh Crude Oil Pipeline', 'Numaligarh Refinery Limited', 10228, 12407, 94, '2026-10-31', 'OD', 'ON_TRACK'],
  ['MoRTH', 'Delhi–Mumbai Expressway, Package 7', 'NHAI', 8300, 10900, 71, '2027-03-31', 'RJ', 'AT_RISK'],
  ['MoRTH', 'Bengaluru–Chennai Expressway', 'NHAI', 17900, 17900, 64, '2027-09-30', 'KA', 'ON_TRACK'],
  ['MoRTH', 'Chennai Port–Maduravoyal Elevated Corridor', 'NHAI', 5855, 6100, 22, '2028-03-31', 'TN', 'STALLED'],
  ['MoRTH', 'Nagpur–Raipur Section Six-laning', 'NHAI', 3100, 3100, 100, '2026-05-31', 'MH', 'COMPLETED'],
  ['MoRTH', 'Pathalgaon–Kunkuri Four-laning (NH-43)', 'MoRTH', 1250, 1250, 4, '2028-12-31', 'CG', 'ON_TRACK'],
  ['Railways', 'Eastern Dedicated Freight Corridor (Sonnagar–Dankuni)', 'DFCCIL', 12500, 14900, 52, '2027-12-31', 'WB', 'DELAYED'],
  ['Railways', 'Mumbai–Ahmedabad High Speed Rail', 'NHSRCL', 98000, 108000, 46, '2029-12-31', 'GJ', 'AT_RISK'],
  ['Railways', 'Patratu–Sonnagar Third Railway Line', 'Railways', 2400, 2600, 100, '2026-01-31', 'JH', 'COMPLETED'],
  ['Coal', 'Talabira Coal Mine Development', 'Coal India Ltd', 3900, 4300, 58, '2027-06-30', 'OD', 'ON_TRACK'],
  ['Coal', 'Kudanali-Luburi Coal Block', 'Mahanadi Coalfields', 2200, 2900, 35, '2028-03-31', 'OD', 'DELAYED'],
  ['Petroleum', 'Mumbai–Nagpur–Jharsuguda Pipeline', 'GAIL (India) Ltd', 6200, 6200, 100, '2026-05-31', 'MH', 'COMPLETED'],
  ['Petroleum', 'HPCL Rajasthan Refinery (Barmer)', 'HPCL Rajasthan Refinery Ltd', 43000, 79000, 88, '2026-12-31', 'RJ', 'AT_RISK'],
  ['Power', 'Ghatampur Thermal Power Plant (3×660 MW)', 'NLC India Ltd', 17000, 19000, 100, '2026-05-31', 'UP', 'COMPLETED'],
  ['Power', 'Telangana Super Thermal Power Project, Stage-II', 'NTPC Ltd', 29000, 29000, 6, '2031-03-31', 'TS', 'ON_TRACK'],
  ['Power', 'Tehri Pumped Storage Plant', 'THDC India Ltd', 3400, 4100, 81, '2026-12-31', 'UK', 'DELAYED'],
  ['MoHUA', 'Ahmedabad Metro Phase-I', 'Metro-Link Express', 10700, 12500, 100, '2026-05-31', 'GJ', 'COMPLETED'],
  ['MoHUA', 'Bengaluru Metro Phase-2A/2B', 'BMRCL', 14700, 15600, 67, '2027-06-30', 'KA', 'DELAYED'],
  ['MoHUA', 'Jabalpur Sewerage Management & Treatment', 'Jabalpur Municipal Corp.', 362, 362, 100, '2026-04-30', 'MP', 'COMPLETED'],
  ['DoWR', 'Polavaram Irrigation Project', 'Polavaram Project Authority', 55000, 55550, 74, '2027-12-31', 'AP', 'AT_RISK'],
  ['DoWR', 'Kosi–Mechi Link Project', 'DoWR, RD & GR', 6300, 6300, 12, '2029-03-31', 'BR', 'STALLED'],
  ['Civil Aviation', 'Navi Mumbai International Airport (Phase 2)', 'NMIAL', 19600, 19600, 55, '2028-03-31', 'MH', 'ON_TRACK'],
  ['Telecom', 'BharatNet Phase-III', 'BBNL', 139000, 139000, 18, '2030-03-31', 'UP', 'DELAYED'],
  ['Steel', 'Modernisation of Bhilai Steel Plant', 'SAIL', 4800, 5200, 79, '2026-12-31', 'CG', 'ON_TRACK'],
  ['Ports', 'Vadhavan Port Development', 'Vadhavan Port Project Ltd', 76220, 76220, 3, '2032-03-31', 'MH', 'ON_TRACK'],
  ['Mines', 'National Critical Mineral Processing Park', 'Ministry of Mines', 1500, 1650, 20, '2028-03-31', 'OD', 'ON_TRACK'],
  ['Higher Education', 'IIT Campus Expansion, Tirupati', 'MoE', 1200, 1350, 62, '2027-03-31', 'AP', 'DELAYED'],
  ['Health', 'AIIMS Darbhanga', 'MoHFW', 1264, 1264, 30, '2028-03-31', 'BR', 'ON_TRACK'],
  ['DPIIT', 'Dholera Industrial Area (DMIC)', 'DMICDC', 5300, 6100, 45, '2028-12-31', 'GJ', 'AT_RISK'],
]
export const SEED = ROWS.map(([s, name, agency, original, revised, progress, endDate, state, status], i) => {
  const m = ministryByShort(s)
  return { id: 's-' + i, real: false, name, agency, ministry: m.name, sector: m.sector, original, revised, progress, endDate, state, status,
    startDate: null, spent: Math.round(revised * (progress / 100) * 0.95) }
})
export const HEADLINE = [
  { k: 'Project Count (No.)', v: '1,731', i: '📑' }, { k: 'Original Cost (in Cr.)', v: '₹ 30,71,947.05', i: '🪙' },
  { k: 'Latest Revised Cost (in Cr.)', v: '₹ 33,60,068.81', i: '💰' }, { k: 'Expenditure (Cumm.) (in Cr.)', v: '₹ 16,32,560.54', i: '📊' },
  { k: 'Completed During Month (No.)', v: '16', i: '✅' }, { k: 'Newly Added (No.)', v: '35', i: '🏗️' }]
// Tile-grid map: [code, name, column, row, weight]
export const TILES = [
  ['JK', 'Jammu & Kashmir', 3, 0, 30], ['LA', 'Ladakh', 4, 0, 6], ['PB', 'Punjab', 2, 1, 40], ['HP', 'Himachal Pradesh', 3, 1, 25], ['UK', 'Uttarakhand', 4, 1, 35],
  ['RJ', 'Rajasthan', 1, 2, 120], ['HR', 'Haryana', 2, 2, 45], ['DL', 'Delhi', 3, 2, 30], ['UP', 'Uttar Pradesh', 4, 2, 180], ['BR', 'Bihar', 5, 2, 100], ['SK', 'Sikkim', 6, 2, 8], ['AR', 'Arunachal Pradesh', 7, 2, 20],
  ['GJ', 'Gujarat', 1, 3, 115], ['MP', 'Madhya Pradesh', 3, 3, 140], ['CG', 'Chhattisgarh', 4, 3, 55], ['JH', 'Jharkhand', 5, 3, 60], ['WB', 'West Bengal', 6, 3, 70], ['AS', 'Assam', 7, 3, 50], ['NL', 'Nagaland', 8, 3, 8],
  ['MH', 'Maharashtra', 2, 4, 175], ['TS', 'Telangana', 3, 4, 70], ['OD', 'Odisha', 4, 4, 85], ['ML', 'Meghalaya', 7, 4, 10], ['MN', 'Manipur', 8, 4, 12],
  ['GA', 'Goa', 2, 5, 8], ['KA', 'Karnataka', 3, 5, 95], ['AP', 'Andhra Pradesh', 4, 5, 90], ['TR', 'Tripura', 7, 5, 8], ['MZ', 'Mizoram', 8, 5, 8],
  ['KL', 'Kerala', 3, 6, 30], ['TN', 'Tamil Nadu', 4, 6, 85], ['PY', 'Puducherry', 5, 6, 5], ['AN', 'Andaman & Nicobar', 7, 7, 6]]
export const STATE_NAME = Object.fromEntries(TILES.map(t => [t[0], t[1]]))
export function stateCounts(total = 1731) {
  const sum = TILES.reduce((a, t) => a + t[4], 0)
  const out = Object.fromEntries(TILES.map(t => [t[0], Math.round(t[4] * total / sum)]))
  out.UP += total - Object.values(out).reduce((a, b) => a + b, 0)
  return out
}

// Fixed questionnaire, per the mitigation model's field weights.
export const QUESTIONNAIRE = [
  ['landAcquisition', 'Are there delays in land acquisition, site handover, or utility shifting?', 25, ['No issue', 'Minor issue', 'Moderate issue', 'Major issue', 'Critical issue']],
  ['financialResult', 'Are funds / budget releases / cash flow delays affecting execution?', 20, ['No issue', 'Minor issue', 'Moderate issue', 'Major issue', 'Critical issue']],
  ['approvalClearance', 'Are approvals, clearances, or administrative decisions pending?', 20, ['No issue', 'Minor issue', 'Moderate issue', 'Major issue', 'Critical issue']],
  ['procurementResult', 'Are there contractor, vendor, or procurement bottlenecks?', 15, ['No issue', 'Minor issue', 'Moderate issue', 'Major issue', 'Critical issue']],
  ['scopeDesign', 'Has the project scope or design changed after sanction?', 10, ['No change', 'Minor changes', 'Moderate changes', 'Major changes', 'Severe changes']],
  ['executionPace', 'Is the execution pace slower than planned due to site issues, labor, or coordination problems?', 10, ['No issue', 'Minor issue', 'Moderate issue', 'Major issue', 'Critical issue']],
  ['interagencyCoordination', 'Are there local-level or inter-agency coordination problems?', 5, ['No issue', 'Minor issue', 'Moderate issue', 'Major issue', 'Critical issue']],
]

// Aggregate a set of projects into the "Ministry of X (as of <month>)" KPI panel shape.
export function aggregate(rows) {
  const original = rows.reduce((a, p) => a + p.original, 0), revised = rows.reduce((a, p) => a + p.revised, 0), spent = rows.reduce((a, p) => a + p.spent, 0)
  return { count: rows.length, original, revised, spent, completed: rows.filter(p => p.status === 'COMPLETED').length, newly: Math.max(1, Math.round(rows.length * 0.02)) }
}
export const HERO_IMAGES = [
  'https://source.unsplash.com/1600x900/?bridge,construction',
  'https://source.unsplash.com/1600x900/?highway,construction',
  'https://source.unsplash.com/1600x900/?airport,construction',
  'https://source.unsplash.com/1600x900/?seaport,construction',
  'https://source.unsplash.com/1600x900/?railway,station,construction',
]

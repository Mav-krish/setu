import { Link, useParams } from 'react-router-dom'
import { Brand, Footer } from '../components.jsx'
const P = {
  about: ['About SETU', 'SETU is the National Infrastructure Risk Monitoring & Management System. It helps ministries track large infrastructure projects, predict cost and schedule risk, collect ground reports from field engineers and plan mitigation.'],
  faqs: ['Frequently Asked Questions', 'Who can register? Ministry officials can register themselves. Field engineer and administrator accounts are issued by the administrator. How is risk predicted? A machine-learning model estimates cost overrun and delay from project data.'],
  contact: ['Contact Us', 'Ministry of Statistics and Programme Implementation, Government of India, Khurshid Lal Bhawan, Janpath, New Delhi-110001. Email: helpdesk@setu.example'],
  privacy: ['Privacy Policy', 'Personal information collected on this portal is used only to provide access and to operate the service. It is not shared with third parties.'],
  hyperlinking: ['Hyperlinking Policy', 'Links to external websites are provided for convenience. The portal is not responsible for the content of linked sites.'],
  sitemap: ['Site Map', 'Home · Dashboard · Projects · Sectors · Ministries · Prediction · AI Assistant · Mitigation · Weather & Climate · About · FAQs · Contact']
}
export default function Info() {
  const { slug } = useParams(); const [t, b] = P[slug] || P.about
  return (<div className="pub"><div className="tri"><i/><i/><i/></div><header className="pubhead"><Brand/><nav><Link to="/">Home</Link></nav></header><main className="infopage"><h2>{t}</h2><p>{b}</p></main><Footer/></div>)
}

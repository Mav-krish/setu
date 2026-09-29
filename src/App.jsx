import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth.jsx'
import Landing from './pages/Landing.jsx'
import Info from './pages/Info.jsx'
import Layout from './pages/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects, { ProjectDetail } from './pages/Projects.jsx'
import Directory from './pages/Directory.jsx'
import Prediction from './pages/Prediction.jsx'
import Chatbot from './pages/Chatbot.jsx'
import Mitigation from './pages/Mitigation.jsx'
import Field from './pages/Field.jsx'
import Admin from './pages/Admin.jsx'
import { About } from './pages/Static.jsx'
const Guard = ({ children }) => { const { user } = useAuth(); return user ? children : <Navigate to="/" replace/> }
const Only = ({ roles, children }) => { const { user } = useAuth(); return roles.includes(user.portal) ? children : <Navigate to="/app" replace/> }
const Home = () => { const { user } = useAuth(); return user.portal === 'engineer' ? <Field/> : user.portal === 'admin' ? <Admin/> : <Dashboard/> }
export default function App() {
  return (<Routes>
    <Route path="/" element={<Landing/>}/><Route path="/info/:slug" element={<Info/>}/>
    <Route path="/app" element={<Guard><Layout/></Guard>}>
      <Route index element={<Home/>}/>
      <Route path="projects" element={<Only roles={['ministry', 'admin']}><Projects/></Only>}/>
      <Route path="projects/:id" element={<Only roles={['ministry', 'admin']}><ProjectDetail/></Only>}/>
      <Route path="sectors" element={<Only roles={['ministry', 'admin']}><Directory kind="sectors"/></Only>}/>
      <Route path="ministries" element={<Only roles={['ministry', 'admin']}><Directory kind="ministries"/></Only>}/>
      <Route path="prediction" element={<Only roles={['ministry']}><Prediction/></Only>}/>
      <Route path="chatbot" element={<Only roles={['ministry']}><Chatbot/></Only>}/>
      <Route path="mitigation" element={<Only roles={['ministry']}><Mitigation/></Only>}/>
      <Route path="about" element={<About/>}/>
    </Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>)
}

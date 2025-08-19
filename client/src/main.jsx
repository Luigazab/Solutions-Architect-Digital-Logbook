import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import './index.css'
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Auth from './layouts/AuthenticationLayout.jsx';
import Home from './pages/Home';
import LogActivity from './pages/LogActivity';
import Customer from './pages/Customer';
import Login from './pages/Login.jsx';
import Report from './pages/Report.jsx';
import Schedule from './pages/Schedule.jsx';
import Certification from './pages/Certification.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import AddMember from './pages/AddMember.jsx';
import Profile from './pages/Profile.jsx';
import Loader from './components/Loader.jsx';

document.documentElement.setAttribute('data-theme', 'light');// Set default theme

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />}>
          <Route index element={<Login/>} />
          <Route path="register" element={<h2 className="text-center text-2xl">Register Page</h2>} />
        </Route>
        
        <Route path="/" element={
          <RequireAuth children={<DashboardLayout />} />
          }>
          <Route index element={<Home />} /> {/* index = default content */}
          <Route path="log-activity" element={<LogActivity />} />
          <Route path="customer" element={<Customer />} />
          <Route path="report" element={<Report />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="certification" element={<Certification />} />
          <Route path="add-member" element={<AddMember/>} />
          <Route path="profile" element={<Profile />} />
          <Route path="loader" element={<Loader />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

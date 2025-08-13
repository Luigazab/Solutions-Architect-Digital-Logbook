import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import './index.css'
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Home from './pages/Home';
import LogActivity from './pages/LogActivity';
import Customer from './pages/Customer';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} /> {/* index = default content */}
          <Route path="log-activity" element={<LogActivity />} />
          <Route path="customer" element={<Customer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

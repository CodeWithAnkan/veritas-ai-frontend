import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import LandingPage   from './pages/LandingPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import SearchPage    from './pages/SearchPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<LandingPage />} />
        <Route path="/dashboard"  element={<DashboardPage />} />
        <Route path="/search"     element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
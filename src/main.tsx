import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing'
import AppLayout from './pages/AppLayout'
import Inbox from './pages/Inbox'
import Contacts from './pages/Contacts'
import Features from './pages/Features'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Inbox />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="features" element={<Features />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

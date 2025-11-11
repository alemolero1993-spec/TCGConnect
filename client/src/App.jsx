import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
import CardDetail from "./pages/CardDetail"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PrivacyPage from "./pages/PrivacyPage"
import CookieBanner from "./components/CookieBanner"
import Footer from "./components/Footer"

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/card/:id" element={<CardDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
          </Routes>
        </div>
        <Footer />
        <CookieBanner />
      </div>
    </BrowserRouter>
  )
}


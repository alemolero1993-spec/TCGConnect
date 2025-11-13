import CollectionDetail from "./CollectionDetail";
import Navbar from "./Navbar";
import AgregarCarta from "./AgregarCarta";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import CollectionPage from "./pages/Collection";

export default function App() {
  return (
    <Router>
      <Navbar />`r`n<Routes>
        <Route path="/coleccion/:id" element={<CollectionDetail />} />
        <Route path="/agregar-carta" element={<AgregarCarta />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/coleccion" element={<CollectionPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}




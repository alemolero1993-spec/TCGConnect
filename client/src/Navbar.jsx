import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      padding: "12px 20px",
      background: "#222",
      color: "white",
      display: "flex",
      gap: "20px",
      alignItems: "center"
    }}>
      <Link to="/collection" style={{ color: "white", textDecoration: "none" }}>Colecciones</Link>
      <Link to="/agregar-carta" style={{ color: "white", textDecoration: "none" }}>Agregar Carta</Link>
    </nav>
  );
}

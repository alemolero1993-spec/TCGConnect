import React from "react";
import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, BookOpen, LogIn, UserPlus } from "lucide-react";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navbar superior animada */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-indigo-600 text-white px-6 py-3 shadow-md flex justify-between items-center"
      >
        <h1 className="text-xl font-semibold tracking-wide">TCGConnect</h1>
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-yellow-300 flex items-center gap-1"><Home size={18}/>Inicio</Link>
          <Link to="/collection" className="hover:text-yellow-300 flex items-center gap-1"><BookOpen size={18}/>Colección</Link>
          <Link to="/login" className="hover:text-yellow-300 flex items-center gap-1"><LogIn size={18}/>Login</Link>
        </div>
      </motion.nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
          <h2 className="font-semibold mb-3 text-gray-700">Menú</h2>
          <ul className="space-y-2">
            <li><Link to="/" className="block hover:text-indigo-600 flex items-center gap-2"><Home size={18}/>Inicio</Link></li>
            <li><Link to="/collection" className="block hover:text-indigo-600 flex items-center gap-2"><BookOpen size={18}/>Mi colección</Link></li>
            <li><Link to="/login" className="block hover:text-indigo-600 flex items-center gap-2"><LogIn size={18}/>Login</Link></li>
            <li><Link to="/register" className="block hover:text-indigo-600 flex items-center gap-2"><UserPlus size={18}/>Registro</Link></li>
          </ul>
        </aside>

        {/* Contenido principal con transición */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          <Outlet />
        </motion.main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-3 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} <span className="text-indigo-600 font-semibold">TCGConnect</span>. Todos los derechos reservados.
      </footer>
    </div>
  );
}
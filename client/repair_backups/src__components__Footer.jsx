import React from "react"
import { Link } from "react-router-dom"
export default function Footer(){ return (<footer className="bg-white border-t mt-6 p-4 text-sm text-gray-600"><div className="max-w-5xl mx-auto flex justify-between items-center"><div>Â© {new Date().getFullYear()} TCGConnect. Todos los derechos reservados.</div><div className="flex gap-4 items-center"><Link to="/privacy-policy" className="underline">PolÃ­tica de Privacidad</Link><a href="#" rel="sponsored noopener noreferrer" className="underline">Aviso de afiliados</a></div></div></footer>) }


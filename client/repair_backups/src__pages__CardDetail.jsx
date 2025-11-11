import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
const API = import.meta.env.VITE_API_BASE || "http://localhost:5000"
export default function CardDetail(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  async function fetchPrices(){ setLoading(true); try{ const res = await fetch(`${API}/api/mock/prices?id=${id}`); const json = await res.json(); setData(json); }catch(e){ console.error(e) }finally{ setLoading(false) } }
  useEffect(()=>{ fetchPrices() }, [id])
  return (
    <div className="min-h-screen p-6">
      <div className="flex items-start gap-6">
        <div className="w-64 bg-white rounded-lg p-4 shadow-sm"><div className="h-64 bg-gray-100 flex items-center justify-center">Imagen</div></div>
        <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Carta detalle â€” id {id}</h2>
          <p className="mt-2 text-sm text-gray-600">Set: Base â€¢ Idioma: EN â€¢ Rareza: Holo</p>
          <div className="mt-4 flex gap-3"><button onClick={fetchPrices} className="px-4 py-2 rounded border">Actualizar precios</button><button className="px-4 py-2 rounded bg-indigo-600 text-white">AÃ±adir a mi colecciÃ³n</button></div>
          <div className="mt-6"><h3 className="font-medium mb-2">Comparador</h3>{loading && <p>Cargando precios...</p>}{data && data.results && (<table className="w-full text-left"><thead className="text-sm text-gray-500"><tr><th>Tienda</th><th>Precio</th><th>Estado</th></tr></thead><tbody>{data.results.map((r,i)=>(<tr key={i} className="border-t"><td>{r.marketplace}</td><td>â‚¬{r.price}</td><td>{r.condition}</td></tr>))}</tbody></table>)}</div>
          <div className="mt-6 text-sm text-gray-500"><Link to="/dashboard" className="text-indigo-600">Volver al dashboard</Link></div>
        </div>
      </div>
    </div>
  )
}


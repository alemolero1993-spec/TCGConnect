import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
const API = import.meta.env.VITE_API_BASE || "http://localhost:5000"
export default function Dashboard(){
  const [cards,setCards]=useState([])
  const [loading,setLoading]=useState(true)
  const [msg,setMsg]=useState("")
  const nav = useNavigate()
  const token = localStorage.getItem("tcg_token")
  useEffect(()=>{ if(!token){ nav("/login"); return } fetchCards() }, [])
  async function fetchCards(){ setLoading(true); try{ const res = await fetch(`${API}/api/collection`, { headers: { Authorization: `Bearer ${token}` } }); if(res.status===401){ localStorage.removeItem("tcg_token"); nav("/login"); return } const json = await res.json(); setCards(json.cards||[]); }catch(e){ console.error(e) } finally{ setLoading(false) } }
  async function addSample(){ try{ const res=await fetch(`${API}/api/collection`,{method:"POST",headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`},body:JSON.stringify({name:"New Card",set:"S1",lang:"EN",rarity:"Rare",value:10})}); const j=await res.json(); setCards(prev=>[j.card,...prev]); setMsg("Carta aÃ±adida"); }catch(e){ console.error(e) } }
  function logout(){ localStorage.removeItem("tcg_token"); nav("/login") }
  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Mi Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={addSample} className="px-3 py-2 rounded bg-white border">AÃ±adir carta de prueba</button>
          <button onClick={logout} className="px-3 py-2 rounded bg-red-100">Logout</button>
        </div>
      </div>
      {msg && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{msg}</div>}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg shadow-sm bg-white">Cartas: {cards.length}</div>
        <div className="p-4 rounded-lg shadow-sm bg-white">Valor estimado: â‚¬{cards.reduce((s,c)=>s+c.value,0)}</div>
        <div className="p-4 rounded-lg shadow-sm bg-white">Sets activos: {Array.from(new Set(cards.map(c=>c.set))).length}</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="font-medium mb-3">Ãšltimas cartas aÃ±adidas</h2>
        {loading? <p>Cargando...</p> : (
          <table className="w-full text-left">
            <thead className="text-sm text-gray-500"><tr><th>Card</th><th>Set</th><th>Idioma</th><th>Valor</th><th></th></tr></thead>
            <tbody>
              {cards.map(c=>(<tr key={c.id} className="border-t"><td>{c.name}</td><td>{c.set}</td><td>{c.lang}</td><td>â‚¬{c.value}</td><td className="text-right"><Link to={'/card/'+c.id} className="text-indigo-600">Ver precios</Link></td></tr>))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}


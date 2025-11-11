import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
const API = import.meta.env.VITE_API_BASE || "http://localhost:5000"
export default function Register(){
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [name,setName]=useState("")
  const [err,setErr]=useState("")
  const nav = useNavigate()
  async function submit(e){
    e.preventDefault()
    setErr("")
    try{
      const res = await fetch(`${API}/api/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password,name})})
      const json = await res.json()
      if(!res.ok) return setErr(json.error||"Error")
      localStorage.setItem("tcg_token", json.token)
      nav("/dashboard")
    }catch(e){ setErr("Error de red") }
  }
  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Registro</h2>
      {err && <div className="mb-3 text-red-600">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre (opcional)" className="w-full px-3 py-2 border rounded" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 border rounded" />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Crear cuenta</button>
        </div>
      </form>
    </div>
  )
}


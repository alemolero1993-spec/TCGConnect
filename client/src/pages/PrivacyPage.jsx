import React, { useEffect, useState } from "react"
function simpleMarkdownToHtml(md){ return md.split("nn").map(block=>{ if(block.startsWith("# ")) return "<h1>"+block.replace("# ","")+"</h1>"; if(block.startsWith("## ")) return "<h2>"+block.replace("## ","")+"</h2>"; return "<p>"+block.replace("n","<br/>")+"</p>"; }).join("") }
export default function PrivacyPage(){ const [md,setMd]=useState("Cargando..."); useEffect(()=>{ fetch("/privacy-policy.md").then(r=>r.text()).then(t=>setMd(t)).catch(()=>setMd("No se pudo cargar")) },[]); return (<div className="max-w-5xl mx-auto p-6 bg-white rounded shadow my-6"><div dangerouslySetInnerHTML={{__html: simpleMarkdownToHtml(md)}} /></div>) }



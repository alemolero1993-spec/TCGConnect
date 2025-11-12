// C:\Users\alemo\tcgconnect\client\src\utils\auth.js
export function getToken(){
  return localStorage.getItem('token') || null;
}

export function setToken(token){
  if(token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

// Extrae payload sin verificar (ÃƒÂºtil para mostrar email/nombre)
export function parseJwt(token){
  if(!token) return null;
  try{
    const payload = token.split('.')[1];
    const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=');
    const decodedStr = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedStr);
  }catch(e){
    return null;
  }
}

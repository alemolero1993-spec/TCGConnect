import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  function fakeLogin(e) { e.preventDefault(); navigate('/'); }
  return (
    <main className='p-6'>
      <h2 className='text-xl font-semibold'>Login (prueba)</h2>
      <form onSubmit={fakeLogin} className='mt-4 flex flex-col gap-2'>
        <input placeholder='email' className='border p-2' />
        <input placeholder='password' type='password' className='border p-2' />
        <button className='mt-2 bg-indigo-600 text-white px-4 py-2 rounded'>Entrar</button>
      </form>
    </main>
  );
}

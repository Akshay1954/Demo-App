import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/authService'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('CASHIER')
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      await authService.signup({ name, email, password, role })
      alert('Signup successful! Please log in.')
      nav('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-lg font-semibold mb-3">Create Account</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full border p-2 rounded"/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded"/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border p-2 rounded"/>
        <select value={role} onChange={e=>setRole(e.target.value)} className="w-full border p-2 rounded">
          <option value="OWNER">OWNER</option>
          <option value="MANAGER">MANAGER</option>
          <option value="CASHIER">CASHIER</option>
        </select>
        <button className="button-primary w-full">Sign Up</button>
      </form>
    </div>
  )
}

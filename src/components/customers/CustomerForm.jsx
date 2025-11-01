import React, { useState } from 'react'
import { createCustomer } from '../../services/customerService'
import { useNavigate } from 'react-router-dom'

export default function CustomerForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setmobile] = useState('')
  const nav = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    await createCustomer({ name, email, mobile })
    nav('/customers')
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-md mx-auto">
      <h2 className="text-lg mb-3">Add Customer</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border p-2 mb-2"/>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 mb-2"/>
      <input value={mobile} onChange={e=>setmobile(e.target.value)} placeholder="Mobile" className="w-full border p-2 mb-2"/>
      <button className="button-primary">Save</button>
    </form>
  )
}

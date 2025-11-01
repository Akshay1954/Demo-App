import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCustomer, updateCustomer } from '../../services/customerService'

export default function CustomerEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    mobile: '',
  })
  const [loading, setLoading] = useState(true)

  // ✅ Load customer data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCustomer(id)
        setCustomer(data)
      } catch (err) {
        alert('Failed to load customer: ' + (err.response?.data?.message || err.message))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  // ✅ Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    console.log('Submitting customer update:', customer)
    try {
      const payload = {
        id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
        purchaseHistory: customer.purchaseHistory || []
      }  

      await updateCustomer(id, customer)
      alert('Customer updated successfully!')
      nav('/customers')
    } catch (err) {
      console.error('Update failed:', err.response?.data || err)  
      alert('Update failed: ' + (err.response?.data?.message || err.message))
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="card max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mobile</label>
          <input
            type="text"
            value={customer.mobile}
            onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        <button type="submit" className="button-primary w-full mt-3">
          Save Changes
        </button>
      </form>
    </div>
  )
}

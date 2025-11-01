import React, { useEffect, useState } from 'react'
import { createBill } from '../../services/billService'
import { listCustomers } from '../../services/customerService'
import { listProducts } from '../../services/productService'
import { useNavigate } from 'react-router-dom'

export default function BillForm() {
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])
  const [total, setTotal] = useState(0)
  const nav = useNavigate()

  // Load customers and products
  useEffect(() => {
    (async () => {
      const [custs, prods] = await Promise.all([listCustomers(), listProducts()])
      setCustomers(custs)
      setProducts(prods)
    })()
  }, [])

  // Recalculate total
  useEffect(() => {
    let t = 0
    for (const item of items) {
      const prod = products.find(p => p.productId === item.productId)
      if (prod) t += prod.price * item.quantity
    }
    setTotal(t)
  }, [items, products])

  // Add new item row
  function addItem() {
    setItems([...items, { productId: '', quantity: 1 }])
  }

  // Update a row
  function updateItem(index, field, value) {
    const updated = [...items]
    updated[index][field] = value
    setItems(updated)
  }

  // Remove a row
  function removeItem(index) {
    const updated = [...items]
    updated.splice(index, 1)
    setItems(updated)
  }

  // Submit
  async function handleSubmit(e) {
    e.preventDefault()

    // find by customerId, id or _id — whichever exists
    const selected = customers.find(
      c =>
        c.customerId === selectedCustomer ||
        c.id === selectedCustomer ||
        c._id === selectedCustomer
    )

    if (!selected) {
      alert('Please select a customer')
      return
    }

    try {
      const billRequest = {
        billId: 'B' + Date.now(),
        customer: {
          name: selected.name,
          email: selected.email,
          mobile: selected.mobile || selected.phone || selected.contactNumber,
        },
        items: items.map(it => ({
          productId: it.productId,
          qty: parseInt(it.quantity, 10),
        })),
        addedBy: 'system',
      }

      await createBill(billRequest)
      alert('Bill created successfully!')
      nav('/bills')
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Error creating bill')
    }
  }

  return (
    <div className="card max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">Create New Bill</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer select */}
        <div>
          <label className="block mb-1 font-medium">Customer</label>
          <select
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c, index) => (
              <option
                key={c.customerId || c.id || c._id || index}
                value={c.customerId || c.id || c._id}
              >
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        {/* Items */}
        <div>
          <label className="block mb-2 font-medium">Items</label>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <select
                  value={item.productId}
                  onChange={e => updateItem(index, 'productId', e.target.value)}
                  className="border p-2 rounded flex-1"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p, i) => (
                    <option
                      key={p.productId || p.id || i}
                      value={p.productId || p.id}
                    >
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => updateItem(index, 'quantity', e.target.value)}
                  className="border p-2 rounded w-24"
                  required
                />

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="text-right font-semibold">Total: ₹{total.toFixed(2)}</div>

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="button-primary w-1/2">
            Create Bill
          </button>
        </div>
      </form>
    </div>
  )
}

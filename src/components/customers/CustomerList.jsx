import React, { useEffect, useState } from 'react'
import { listCustomers, deleteCustomer } from '../../services/customerService'
import { Link } from 'react-router-dom'

export default function CustomerList() {
  const [customers, setCustomers] = useState([])

  useEffect(() => { load() }, [])
  async function load() {
    const data = await listCustomers()
    setCustomers(data)
  }

  async function remove(id) {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id)
      load()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Customers</h2>
        <Link to="/customers/new" className="button-primary">Add Customer</Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-3">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map(c => (
                <tr key={c.id || c.customerId}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.mobile}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link
                        to={`/customers/${c.id}`}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2"
                      >
                        Edit
                      </Link>


                      <Link
                        to={`/customers/${c.id || c.customerId}/history`}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      >
                        View History
                      </Link>

                      <button
                        onClick={() => remove(c.id || c.customerId)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

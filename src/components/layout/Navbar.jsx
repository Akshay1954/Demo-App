import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'

export default function Navbar() {
  const nav = useNavigate()
  const user = authService.getUserFromToken()

  const logout = () => {
    authService.clearTokens()
    nav('/login')
  }

  return (
    <nav className="bg-blue-700 text-white p-3 flex justify-between items-center">
      {/* Left section — App name + navigation */}
      <div className="flex gap-4 items-center">
        <Link to="/" className="font-semibold text-lg">
          Smart Retail
        </Link>

        {user && (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/products" className="hover:underline">
              Products
            </Link>
            <Link to="/bills" className="hover:underline">
              Bills
            </Link>
            <Link to="/customers" className="hover:underline">
              Customers
            </Link>
            <Link to="/reports" className="hover:underline">
              Reports
            </Link>

            {/* ✅ New Profile link */}
            <Link to="/profile" className="hover:underline text-yellow-300">
              Profile
            </Link>
          </>
        )}
      </div>

      {/* Right section — user info + logout */}
      {user ? (
        <div className="flex gap-3 items-center">
          <span className="text-sm">{user.sub}</span>
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" className="bg-white text-blue-700 px-3 py-1 rounded">
          Login
        </Link>
      )}
    </nav>
  )
}

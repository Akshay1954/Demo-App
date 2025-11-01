import React, { useState } from 'react';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      // 🔹 Call backend
      const data = await authService.login({ email, password });

      // 🔹 Match backend’s field names
      if (data && data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken || '');
      } else {
        throw new Error('No access token received from backend.');
      }

      // ✅ Redirect to dashboard
      nav('/dashboard');
    } catch (e) {
      console.error('Login error:', e);
      setErr(e.response?.data?.message || e.message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Login</h2>
      {err && <div className="text-red-600 mb-2 text-center">{err}</div>}

      <form onSubmit={submit} className="space-y-4">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Login
        </button>
      </form>

      <p className="text-sm mt-4 text-center text-gray-600">
        Don’t have an account?{' '}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up here
        </a>
      </p>
    </div>
  );
}

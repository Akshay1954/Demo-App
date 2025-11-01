import React, { useState, useEffect } from "react";
import authService from "../../services/authService";

export default function ProfilePage() {
  const user = authService.getUserFromToken();
  const [language, setLanguage] = useState(localStorage.getItem("sr_lang") || "en");

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    localStorage.setItem("sr_lang", selectedLang);
    window.location.reload(); // Reload to apply translations globally
  };

  if (!user) {
    return <p className="text-center mt-10">Not logged in</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

      <p>👤 <strong>Email:</strong> {user.email}</p>
      <p>🏷️ <strong>Role:</strong> {user.role || "N/A"}</p>

      <div className="mt-6">
        <label className="block mb-2 font-medium">🌍 Preferred Language:</label>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border p-2 rounded w-full"
        >
          <option value="en">English</option>
          <option value="hi">Hindi (हिन्दी)</option>
          <option value="mr">Marathi (मराठी)</option>
          <option value="te">Telugu (తెలుగు)</option>
        </select>
      </div>

      <p className="mt-4 text-gray-500 text-sm text-center">
        Logged in as {user.email}
      </p>
    </div>
  );
}

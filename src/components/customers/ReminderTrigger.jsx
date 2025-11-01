
// src/components/customers/ReminderTrigger.jsx
import React, { useState } from "react";
import { triggerReminders } from "../../services/customerService";

export default function ReminderTrigger() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTrigger() {
    setLoading(true);
    setStatus("");
    try {
      const res = await triggerReminders();
      setStatus(res.message || "Reminders triggered successfully!");
    } catch (err) {
      setStatus(err.response?.data?.error || "Failed to trigger reminders");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card max-w-md mx-auto text-center p-6">
      <h2 className="text-lg font-semibold mb-4">📅 Monthly Purchase Reminders</h2>
      <button
        onClick={handleTrigger}
        disabled={loading}
        className="button-primary px-4 py-2"
      >
        {loading ? "Sending..." : "Send Monthly Reminders"}
      </button>

      {status && (
        <p className="mt-3 text-sm font-medium text-blue-600">{status}</p>
      )}
    </div>
  );
}


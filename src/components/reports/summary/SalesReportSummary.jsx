import React, { useState, useEffect } from "react";
import api from "../../../api/apiClient";
import SalesReportText from "../text/SalesReportText";

export default function SalesReportSummary() {
  const [summary, setSummary] = useState(null);
  const [showTextReport, setShowTextReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await api.get("/api/analytics/report");
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
        setError("Failed to load summary report");
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) return <div className="p-4">Loading summary report...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Sales Summary Report</h2>

      {/* Toggle button */}
      <button
        onClick={() => setShowTextReport(!showTextReport)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        {showTextReport ? "Hide Text Report" : "View Text Report"}
      </button>

      {showTextReport ? (
        <SalesReportText />
      ) : (
        <div className="bg-white shadow rounded p-4">
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(summary, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

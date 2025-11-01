import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPurchaseHistory } from "../../services/customerService";

export default function CustomerHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchHistory();
  }, [id]);

  async function fetchHistory() {
    try {
      const data = await getPurchaseHistory(id);
      setHistory(data);
    } catch (err) {
      console.error("Error fetching purchase history:", err);
      setError(err.response?.data?.error || "Failed to load history");
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Customer Purchase History</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {!id ? (
        <p className="text-red-500">Invalid Customer ID</p>
      ) : history.length === 0 ? (
        <p>No purchase history found.</p>
      ) : (
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Bill ID</th>
              <th className="border px-3 py-2 text-left">Date</th>
              <th className="border px-3 py-2 text-right">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((bill) => {
              // Defensive fallback for missing data
              const total = bill.total ?? 0;
              const createdAt = bill.createdAt
                ? new Date(bill.createdAt).toLocaleString()
                : "N/A";
              return (
                <tr key={bill.billId || bill.id}>
                  <td className="border px-3 py-1">{bill.billId || "N/A"}</td>
                  <td className="border px-3 py-1">{createdAt}</td>
                  <td className="border px-3 py-1 text-right">
                    ₹{Number(total).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

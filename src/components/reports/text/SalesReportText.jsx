import React, { useEffect, useState } from "react";
import api from "../../../api/apiClient";

export default function SalesReportText() {
  const [textReport, setTextReport] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTextReport() {
      try {
        const res = await api.get("/api/analytics/report/text");

        // If backend returns { report: "..." } — extract it
        const reportData =
          typeof res.data === "object" && res.data.report
            ? res.data.report
            : res.data;

        setTextReport(reportData || "No report data available");
      } catch (err) {
        console.error("Error fetching text report:", err);
        setError("Failed to load text report");
      }
    }
    fetchTextReport();
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!textReport) return <div>Loading text report...</div>;

  return (
    <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
      {textReport}
    </pre>
  );
}

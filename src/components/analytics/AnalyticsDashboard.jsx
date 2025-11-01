import React, { useEffect, useState } from 'react'
import { getDailyAnalytics, getMonthlyAnalytics, getTopProducts, getRevenueTrend } from '../../services/analyticsService'

export default function AnalyticsDashboard() {
  const [daily, setDaily] = useState([])
  const [monthly, setMonthly] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [trend, setTrend] = useState([])

  useEffect(() => {
    (async () => {
      setDaily(await getDailyAnalytics())
      setMonthly(await getMonthlyAnalytics())
      setTopProducts(await getTopProducts())
      setTrend(await getRevenueTrend())
    })()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Daily Analytics</h3>
          <pre className="text-sm bg-gray-50 p-2 rounded">{JSON.stringify(daily, null, 2)}</pre>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Monthly Analytics</h3>
          <pre className="text-sm bg-gray-50 p-2 rounded">{JSON.stringify(monthly, null, 2)}</pre>
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Top Products</h3>
        <ul className="list-disc pl-6">
          {topProducts.map((p, i) => <li key={i}>{p.name} — {p.salesCount}</li>)}
        </ul>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Revenue Trend</h3>
        <pre className="text-sm bg-gray-50 p-2 rounded">{JSON.stringify(trend, null, 2)}</pre>
      </div>
    </div>
  )
}

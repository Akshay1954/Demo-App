import React, { useEffect, useState } from 'react'
import { listBills, downloadBillPdf, bulkUploadBills, resendBillEmail } from '../../services/billService'
import FileUploader from '../common/FileUploader'

export default function BillList() {
  const [bills, setBills] = useState([])
  const [uploading, setUploading] = useState(false)
  const [resending, setResending] = useState(false)

  // Load all bills from backend
  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await listBills()
      setBills(data)
    } catch (err) {
      alert('Failed to load bills: ' + (err.response?.data?.message || err.message))
    }
  }

  // Download bill PDF
  async function handleDownload(bill) {
    try {
      const blob = await downloadBillPdf(bill.billId, bill.pdfAccessToken)
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `bill_${bill.billId}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to download bill PDF: ' + (err.response?.data?.message || err.message))
    }
  }


  // Resend bill email
  async function handleResend(billId) {
    try {
      setResending(true)
      await resendBillEmail(billId)
      alert('Bill email resent successfully!')
    } catch (err) {
      alert('Failed to resend bill email: ' + (err.response?.data?.message || err.message))
    } finally {
      setResending(false)
    }
  }

  // Bulk CSV upload
  async function handleFileUpload(file) {
    if (!file) return
    try {
      setUploading(true)
      await bulkUploadBills(file)
      alert('Bulk upload successful!')
      await load()
    } catch (err) {
      alert('Bulk upload failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Bills</h2>
        <div className="flex gap-3 items-center">
          <a
            href="/bills/new"
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            + New Bill
          </a>
          <FileUploader
            label="Bulk Upload CSV"
            accept=".csv"
            onFileSelect={handleFileUpload}
          />
        </div>
      </div>

      {uploading && <div className="text-sm text-gray-600 mb-2">Uploading...</div>}
      {resending && <div className="text-sm text-gray-600 mb-2">Resending email...</div>}

      <div className="card overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-3">
                  No bills found.
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.billId}>
                  <td>{bill.billId}</td>
                  <td>{bill.customer?.name || '—'}</td>
                  <td>₹{bill.totalAmount?.toFixed(2) || 0}</td>
                  <td>{new Date(bill.createdAt || bill.date).toLocaleString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleDownload(bill)}
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleResend(bill.billId)}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Resend Email
                    </button>
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

import api from '../api/apiClient';


export async function createBill(bill) {
  const res = await api.post('/api/bills', bill, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
}


export async function getBill(billId) {
  const res = await api.get(`/api/bills/${billId}`);
  return res.data;
}
export async function listBills() {
  const res = await api.get('/api/bills');
  return res.data;
}
export async function downloadBillPdf(billId, token=null) {
  const url = token ? `/api/bills/${billId}/pdf?token=${encodeURIComponent(token)}` : `/api/bills/${billId}/pdf`;
  const res = await api.get(url, { responseType: 'blob' });
  return res.data;
}
export async function bulkUploadBills(csvFile) {
  const form = new FormData();
  form.append('file', csvFile);
  const res = await api.post('/api/bills/bulk', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function resendBillEmail(billId) {
  return api.post(`/api/bills/resend-email/${billId}`)
}

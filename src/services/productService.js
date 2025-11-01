import api from '../api/apiClient';

export async function listProducts() {
  const res = await api.get('/api/products');
  return res.data;
}

export async function getProduct(id) {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
}

// JSON product creation (as in controller: consumes = application/json)
export async function createProductJson(productRequest) {
  const res = await api.post('/api/products', productRequest, {
    headers: { 'Content-Type': 'application/json' }
  });
  return res.data;
}

// multipart (with image)

export async function createProductMultipart(productRequest, imageFile) {
  const form = new FormData();
  form.append("product", JSON.stringify(productRequest)); // must match @RequestParam("product")
  if (imageFile) form.append("imageFile", imageFile); // must match @RequestPart("imageFile")

  console.log("Sending Product:", productRequest); // ✅ Debug
  console.log("FormData contents:");
  for (let [k, v] of form.entries()) console.log(k, v);

  const res = await api.post("/api/products", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}






// CSV bulk upload endpoint (if implemented)
export async function bulkUploadProducts(csvFile) {
  const form = new FormData();
  form.append('file', csvFile);
  const res = await api.post('/api/products/bulk', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function updateProduct(productId, product) {
  const res = await api.put(`/api/products/${productId}`, product);
  return res.data;
}

export async function deleteProduct(productId) {
  const res = await api.delete(`/api/products/${productId}`);
  return res.data;
}

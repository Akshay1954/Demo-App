import React, { useEffect, useState } from 'react';
import {
  createProductJson,
  createProductMultipart,
  getProduct,
  updateProduct
} from '../../services/productService';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductForm() {
  const { id } = useParams(); // comes from /products/:id
  const nav = useNavigate();

  const [productId, setProductId] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(id && id !== 'null' && id !== 'undefined');

  // ✅ Load product details only if id is valid
  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);
      console.log(`Fetching product with ID: ${id}`);
      const data = await getProduct(id);
      if (!data) throw new Error('Product not found');

      setProductId(data.productId || '');
      setName(data.name || '');
      setCategory(data.category || '');
      setPrice(data.price || 0);
      setQuantity(data.quantity || 0);
    } catch (err) {
      console.error('Error loading product:', err);
      alert('⚠️ Failed to load product details. Check if product exists.');
      nav('/products');
    } finally {
      setLoading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    const request = { productId, name, category, price, quantity };

    try {
      if (isEdit) {
        await updateProduct(id, request);
        alert('✅ Product updated successfully');
      } else {
        if (image) {
          await createProductMultipart(request, image);
        } else {
          await createProductJson(request);
        }
        alert('✅ Product created successfully');
      }
      nav('/products');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || 'Operation failed');
    }
  }

  return (
    <form className="card max-w-lg mx-auto" onSubmit={submit}>
      <h2 className="text-lg mb-2">
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {!isEdit && (
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Product ID"
              className="w-full p-2 border mb-2"
              required
            />
          )}

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border mb-2"
            required
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full p-2 border mb-2"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price"
            className="w-full p-2 border mb-2"
            required
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Quantity"
            className="w-full p-2 border mb-2"
            required
          />

          {!isEdit && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="mb-2"
            />
          )}

          <div className="flex gap-2">
            <button className="button-primary">
              {isEdit ? 'Update' : 'Save'}
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() => nav('/products')}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </form>
  );
}

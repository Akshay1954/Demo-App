import React, { useEffect, useState } from 'react';
import { listProducts } from '../../services/productService';
import { Link, useNavigate } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await listProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Invalid products response:", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      alert("Failed to load products");
    }
  }

  function handleEdit(productId) {
    if (!productId) {
      alert("Product ID missing!");
      return;
    }
    navigate(`/products/edit/${productId}`);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Products</h2>
        <Link to="/products/new" className="button-primary">
          Add Product
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-3">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p, index) => {
                // ✅ Safely extract an ID for keys and edit links
                const productKey =
                  p.productId || p.id || p._id || `unknown-${index}`;

                return (
                  <tr key={productKey}>
                    <td>{p.name || 'Unnamed Product'}</td>
                    <td>{p.category || '—'}</td>
                    <td>{p.price?.toFixed?.(2) || 0}</td>
                    <td>{p.quantity ?? 0}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(productKey)}
                        className="button-secondary"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

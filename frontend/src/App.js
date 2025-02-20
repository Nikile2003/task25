import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "", image: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/products");
    setProducts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));

    await axios.post("http://localhost:5000/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="container">
      <h2 className="title">E-Commerce Product Management</h2>

      {/* Product Form */}
      <form className="product-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="text" placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Price" onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input type="text" placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input type="number" placeholder="Stock" onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <input type="file" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} required />
        <button type="submit">Add Product</button>
      </form>

      {/* Product Cards */}
      <div className="product-grid">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            {product.image && <img src={`http://localhost:5000${product.image}`} alt={product.name} />}
            <h5>{product.name}</h5>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Nikile2003@",
  database: "ecommerce",
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

// Multer Configuration for File Upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// Routes
app.post("/products", upload.single("image"), (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !price || !category) {
    return res.status(400).json({ message: "Name, Price, and Category are required" });
  }

  const sql = "INSERT INTO products (name, description, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, description, price, category, stock, image], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", err });
    res.status(201).json({ id: result.insertId, name, description, price, category, stock, image });
  });
});

app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.delete("/products/:id", (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Product deleted successfully" });
  });
});

// Start Server
app.listen(5000, () => console.log("Backend running on http://localhost:5000"));

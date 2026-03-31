process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/SparkleGlow";
const JWT_SECRET = process.env.JWT_SECRET || "sparkle_secret_key_2026";

// ── Database Connection ───────────────────────────────────────
mongoose.connect(dbURL, { serverSelectionTimeoutMS: 5000, family: 4 })
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.log("❌ Error:", err.message));

// ── Middleware ────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Login karein pehle!" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Token invalid hai!" });
  }
};

// ── SCHEMAS & MODELS ──────────────────────────────────────────

const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String, price: Number, desc: String, image: String,
  category: String, emoji: String, rating: Number, reviews: Number, badge: String,
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  items: Array,
  totalAmount: Number,
  address: Object,
  paymentMethod: { type: String, default: 'COD' },
  status: { type: String, default: 'Placed' },
  createdAt: { type: Date, default: Date.now },
}));

const Rating = mongoose.model('Rating', new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  productId: mongoose.Schema.Types.ObjectId,
  stars: Number,
  review: String,
}).index({ userId: 1, productId: 1 }, { unique: true }));

// ── ROUTES ────────────────────────────────────────────────────

// 1. REAL-TIME STATS (Sabse Pehle)
app.get('/api/orders/all-count', async (req, res) => {
  try {
    const count = await Order.countDocuments();
    // Base 1250 customers + real orders
    res.json({ count: count + 1250 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. AUTH ROUTES
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, user: { name: user.name, email: user.email, id: user._id } });
  } catch (e) { res.status(400).json({ message: "Email already exists!" }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, user: { name: user.name, email: user.email, id: user._id } });
  } else res.status(401).json({ message: "Invalid credentials" });
});

// 3. PRODUCT ROUTES
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products/seed', async (req, res) => {
  await Product.deleteMany({});
  const items = [
    { name: 'Glow Boost Face Wash', price: 899, category: 'Face Wash', rating: 4.8, reviews: 234, badge: 'Best Seller', emoji: '🧴', desc: 'Vitamin C & Niacinamide' },
    { name: 'Hydra Surge Moisturizer', price: 1299, category: 'Moisturizer', rating: 4.7, reviews: 189, badge: 'New', emoji: '💧', desc: 'Hyaluronic acid hydration' },
    { name: 'Clear Skin Serum', price: 1599, category: 'Serum', rating: 4.9, reviews: 312, badge: 'Top Rated', emoji: '✨', desc: 'Salicylic acid + retinol' },
    { name: 'SPF 50 Sunscreen', price: 749, category: 'Sunscreen', rating: 4.6, reviews: 445, badge: '', emoji: '☀️', desc: 'Lightweight protection' }
  ];
  await Product.insertMany(items);
  res.json({ message: "Seeded!" });
});

// 4. ORDER ROUTES
app.post('/api/orders', authMiddleware, async (req, res) => {
  const { items, address, paymentMethod } = req.body;
  const user = await User.findById(req.user.id);
  const total = items.reduce((s, i) => s + (i.price * i.qty), 0);
  const order = new Order({ userId: req.user.id, userName: user.name, items, totalAmount: total, address, paymentMethod });
  await order.save();
  res.status(201).json({ message: "Order Placed! 🎉", order });
});

app.get('/api/orders/my-orders', authMiddleware, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

// 5. RATING ROUTES
app.post('/api/products/:id/rate', authMiddleware, async (req, res) => {
  const { stars, review } = req.body;
  const rating = new Rating({ userId: req.user.id, productId: req.params.id, stars, review });
  await rating.save();
  
  const all = await Rating.find({ productId: req.params.id });
  const avg = all.reduce((s, r) => s + r.stars, 0) / all.length;
  const updated = await Product.findByIdAndUpdate(req.params.id, { rating: avg.toFixed(1), reviews: all.length }, { new: true });
  res.json({ newRating: updated.rating, newReviews: updated.reviews });
});

app.listen(PORT, () => console.log(`🚀 Server running: http://localhost:${PORT}`));
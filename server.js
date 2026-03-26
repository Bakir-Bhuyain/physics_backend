require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// ── Import Routes ──────────────────────────────────────
const authRoutes = require('./src/routes/auth');
const topicRoutes = require('./src/routes/topics');
const aiRoutes = require('./src/routes/ai');
const progressRoutes = require('./src/routes/progress');

const app = express();

// ── Connect to MongoDB ─────────────────────────────────
connectDB();

// ── Middleware ─────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  /\.netlify\.app$/ // Allow any Netlify sub-domain
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(ao => (typeof ao === 'string' ? ao === origin : ao.test(origin)))) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy violation'), false);
  },
  credentials: true,
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);

// ── Health Check ───────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SSC Physics API is running 🚀' });
});

// ── Global Error Handler ───────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// ── Start Server ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📚 SSC Physics API ready at http://localhost:${PORT}/api`);
});

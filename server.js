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

app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:4173',
  'https://ssc-physics-frontend.onrender.com',
  'https://resonant-tapioca-08d3a8.netlify.app',
  /\.netlify\.app$/,
  /\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some(ao =>
      typeof ao === 'string' ? ao === origin : ao.test(origin)
    );
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ── Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);

// ── Health Check ───────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── Error Handling ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Neural Server active on port ${PORT}`);
});
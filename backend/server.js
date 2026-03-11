require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/auth.routes');
const subjectRoutes = require('./src/routes/subject.routes');
const noteRoutes = require('./src/routes/note.routes');
const chatRoutes = require('./src/routes/chat.routes');
const userRoutes = require('./src/routes/user.routes');

const app = express();

// ── Middleware ──
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode}`);
  });
  next();
});

// ── Routes ──
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Edumentor API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

// ── Catch-all 404 ──
app.use((req, res) => {
  console.log(`[${new Date().toISOString()}] 404 NOT FOUND: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
    code: 'NOT_FOUND',
  });
});

// ── Error Handler ──
app.use(errorHandler);

// ── Database + Server Start ──
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Edumentor backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

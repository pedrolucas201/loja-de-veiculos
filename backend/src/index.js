const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const anunciosRoutes = require('./routes/anuncios');
const uploadRoutes = require('./routes/upload');

const app = express();
app.use(cors());

// Lista branca de origins
const allowedOrigins = [
  'https://uniao-motos.vercel.app',
  'https://uniao-motos.onrender.com',    // seu domínio de API
  'http://localhost:3000',               // front em dev
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // permitir chamadas sem origin (Postman, servidores, mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS Bloqueado para origem ${origin}`));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

app.use(express.json());

app.get('/ping', (req, res) => res.send('pong'));
app.get('/', (req, res) => res.send('API is running'));

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/anuncios', anunciosRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Servidor na porta ${PORT}`));
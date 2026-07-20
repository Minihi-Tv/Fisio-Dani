const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./logger');
const exerciseCtrl = require('./controllers/exerciseController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// --- SERVIR ARCHIVOS ESTÁTICOS ---
// Esto hace que tu HTML y las imágenes sean visibles
app.use(express.static(path.join(__dirname, 'public')));

// --- RUTAS DE LA API ---
app.get('/api/exercises/random', exerciseCtrl.getRandomExercise);
app.get('/api/exercises/:id', exerciseCtrl.getExerciseById);
app.get('/api/exercises', exerciseCtrl.getExercises);
app.get('/api/categories', exerciseCtrl.getUniqueList('category'));
app.get('/api/body-parts', exerciseCtrl.getUniqueList('body_part'));
app.get('/api/equipment', exerciseCtrl.getUniqueList('equipment'));

// Ruta para el Frontend (envía el index.html al entrar a la raíz)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});
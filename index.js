const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./logger');
const exerciseCtrl = require('./controllers/exerciseController');

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

// Servir Frontend
app.use(express.static('public'));

// API Endpoints
app.get('/api/exercises/random', exerciseCtrl.getRandomExercise);
app.get('/api/exercises/:id', exerciseCtrl.getExerciseById);
app.get('/api/exercises', exerciseCtrl.getExercises);
app.get('/api/categories', exerciseCtrl.getUniqueList('category'));
app.get('/api/body-parts', exerciseCtrl.getUniqueList('body_part'));
app.get('/api/equipment', exerciseCtrl.getUniqueList('equipment'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

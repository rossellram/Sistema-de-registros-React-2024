// En routes/index.js
const express = require('express');
const formRoutes = require('./formRoutes');
const loginRoutes = require('./loginRoutes'); 

const router = express.Router();

// Rutas específicas del formulario
router.use('/form', formRoutes);

// Rutas específicas de autenticación
router.use('/login', loginRoutes);

module.exports = router;
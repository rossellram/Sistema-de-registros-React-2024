// LoginRoutes.js

const express = require('express');
const md5 = require('md5');
const pool = require('../db/pool');

const router = express.Router();

// Middleware para verificar la autenticación
function verificarAutenticacion(req, res, next) {
  if (req.session.userId) {
    // Usuario autenticado, continuar con la solicitud
    next();
  } else {
    // Usuario no autenticado, redirigir a la página de inicio de sesión u otra acción
    res.redirect('/login');
  }
}

// Ruta para manejar la autenticación
router.post('/login', async (req, res) => {
  console.log('Solicitud de inicio de sesión recibida:', req.body);

  const { usuario, contrasena } = req.body;

  try {
    // Busca el usuario en la base de datos en el esquema B_ODU
    const result = await pool.query('SELECT * FROM B_ODU.users WHERE username = $1', [usuario]);

    if (result.rows.length === 1) {
      const storedPasswordHash = result.rows[0].password_hash;
      const hashedPassword = md5(contrasena);

      console.log('Contraseña almacenada en la base de datos:', storedPasswordHash);
      console.log('Contraseña proporcionada en la solicitud:', hashedPassword);

      // Verificar si la contraseña proporcionada coincide con alguna de las permitidas
      if (hashedPassword === storedPasswordHash) {
        console.log('Contraseña válida');
        req.session.userId = result.rows[0].id;
        res.json({ success: true, message: 'Inicio de sesión exitoso' });
      } else {
        console.log('Contraseñas NO coinciden');
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }
    } else {
      console.log('Usuario no encontrado');
      res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(500).json({ success: false, message: 'Error de autenticación' });
  }
});

// Ruta protegida
router.get('/ruta-protegida', verificarAutenticacion, (req, res) => {
  res.send('Esta es una ruta protegida');
});

module.exports = router;

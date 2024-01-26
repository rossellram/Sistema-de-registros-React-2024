const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// Función de validación de Base64
const isValidBase64 = (str) => {
  try {
    // Intentar decodificar la cadena Base64
    const decoded = atob(str);

    // Verificar si la decodificación es exitosa y la longitud es mayor a 0
    return decoded && decoded.length > 0;
  } catch (err) {
    return false;
  }
};
// Configurar express con límites mayores
router.use(express.json({ limit: '500mb' }));
router.use(express.urlencoded({ extended: true, limit: '500mb' }));


// Obtener todos los formularios
router.get('/datos-almacenados', async (req, res) => {
  try {
    const result = await pool.query('SELECT formulario.*, users.username as nombre_usuario FROM B_ODU.formulario LEFT JOIN B_ODU.users ON formulario.user_id = users.username');

    const resultWithImages = await Promise.all(result.rows.map(async (row) => {
      try {
        const imagesResult = await pool.query('SELECT imagen FROM B_ODU.imagenes WHERE formulario_id = $1', [row.id]);
        const images = imagesResult.rows.map((imageRow) => imageRow.imagen);
        const base64Images = images.map((imageBuffer) => imageBuffer.toString('base64'));

        return {
          ...row,
          imagenes: base64Images,
        };
      } catch (error) {
        console.error('Error al obtener imágenes para el formulario con ID:', row.id, error);
        return {
          ...row,
          imagenes: null,
        };
      }
    }));

    res.status(200).json(resultWithImages);
  } catch (error) {
    console.error('Error al obtener datos almacenados:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Guardar los datos almacenados en la base de datos
// Ruta POST para almacenar datos del formulario asociados al usuario
router.post('/form', async (req, res) => {
  try {
    const formData = req.body;

    if (!formData || !formData.user || !formData.user.username) {
      console.log('Usuario o nombre de usuario no definido en la solicitud.', formData);
      throw new Error('Usuario o nombre de usuario no definido en la solicitud.');
    }

    const user = formData.user;
    console.log('Información del usuario enviada:', user);

    const resultFormulario = await pool.query(
      'INSERT INTO B_ODU.formulario (fecha_publicacion, tipo_de_medio, nombre_medio, otro_tipo_medio, otro_nombre_medio, descripcion, como_se_entero, enlaces, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [
        formData.fecha,
        formData.tipoDeMedio,
        formData.nombreMedio,
        formData.otroTipoMedio || null,
        formData.otroNombreMedio || null,
        formData.descripcion,
        formData.comoSeDioCuenta,
        formData.enlaces,
        user.username,
      ]
    );

    const imagesInsertPromises = formData.imagenes.map(async (image) => {
      // Validar la cadena Base64 antes de la conversión
      if (!isValidBase64(image)) {
        console.error('La cadena proporcionada no es una cadena Base64 válida.');
        throw new Error('La cadena proporcionada no es una cadena Base64 válida.');
      }

    

      await pool.query('INSERT INTO B_ODU.imagenes (formulario_id, imagen) VALUES ($1, $2)', [resultFormulario.rows[0].id, Buffer.from(image, 'base64')]);
    });

    await Promise.all(imagesInsertPromises);

    res.status(200).json({ message: 'Datos insertados correctamente.' });
  } catch (error) {
    console.error('Error al insertar datos en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});



module.exports = router;

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const routes = require('./src/routes');

const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 60000,
  },
}));

app.use(cors(corsOptions));
app.use(express.json({ limit: '500mb' }));  // Configura el límite de tamaño del JSON
app.use(express.urlencoded({ extended: true, limit: '500mb' }));  // Configura el límite de tamaño del formulario

app.use('/', routes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

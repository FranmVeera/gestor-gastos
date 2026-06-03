const express = require('express');
const cors = require('cors');

const rutasGastos = require('./routes/gastoRoutes');

const app = express();
const PUERTO = 3001;

app.disable('x-powered-by');

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Gestión de Gastos funcionando correctamente'
  });
});

app.use('/api/gastos', rutasGastos);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PUERTO, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
  });
}

module.exports = app;
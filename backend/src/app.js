const express = require('express');
const cors = require('cors');

const rutasGastos = require('./routes/gastoRoutes');

const app = express();
const PUERTO = 3001;

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.disable('x-powered-by');
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Gestión de Gastos funcionando correctamente'
  });
});

app.use('/api/gastos', rutasGastos);

app.listen(PUERTO, () => {
  console.log(
    `Servidor ejecutándose en http://localhost:${PUERTO}`
  );
});
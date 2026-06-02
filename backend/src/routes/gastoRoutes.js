const express = require('express');

const {
  obtenerGastos,
  crearGasto,
  actualizarGasto,
  eliminarGasto
} = require('../controllers/gastoController');

const router = express.Router();

router.get('/', obtenerGastos);
router.post('/', crearGasto);
router.put('/:id', actualizarGasto);
router.delete('/:id', eliminarGasto);

module.exports = router;

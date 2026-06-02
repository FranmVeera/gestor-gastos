const supabase = require('../database/conexion');

const obtenerGastos = async (req, res) => {
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .order('fecha', { ascending: false });

  if (error) {
    return res.status(500).json({ mensaje: error.message });
  }

  res.json(data);
};

const crearGasto = async (req, res) => {
  const { descripcion, monto, categoria, fecha } = req.body;

  if (!descripcion || !monto || !categoria || !fecha) {
    return res.status(400).json({
      mensaje: 'Todos los campos son obligatorios'
    });
  }

  const { data, error } = await supabase
    .from('gastos')
    .insert([{ descripcion, monto, categoria, fecha }])
    .select();

  if (error) {
    return res.status(500).json({ mensaje: error.message });
  }

  res.status(201).json(data[0]);
};

const actualizarGasto = async (req, res) => {
  const { id } = req.params;
  const { descripcion, monto, categoria, fecha } = req.body;

  const { data, error } = await supabase
    .from('gastos')
    .update({ descripcion, monto, categoria, fecha })
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ mensaje: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ mensaje: 'Gasto no encontrado' });
  }

  res.json({
    mensaje: 'Gasto actualizado correctamente',
    gasto: data[0]
  });
};

const eliminarGasto = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('gastos')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ mensaje: error.message });
  }

  res.json({ mensaje: 'Gasto eliminado correctamente' });
};

module.exports = {
  obtenerGastos,
  crearGasto,
  actualizarGasto,
  eliminarGasto
};
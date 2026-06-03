const obtenerGastos = async () => {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) {
      throw new TypeError('Error en la respuesta del servidor');
    }

    const datos = await respuesta.json();

    if (!Array.isArray(datos)) {
      throw new TypeError('La respuesta del servidor no es un listado válido');
    }

    /** @type {GastoAPI[]} */
    const gastosSeguros = datos.map((gasto) => {
      return {
        id: gasto.id ? Number(gasto.id) : Date.now(),
        descripcion: gasto.descripcion ? String(gasto.descripcion).trim() : 'Sin descripción',
        monto: gasto.monto ? Math.abs(Number(gasto.monto)) || 0 : 0,
        categoria: gasto.categoria ? String(gasto.categoria).trim() : 'Otros',
        fecha: gasto.fecha ? String(gasto.fecha).trim() : ''
      };
    });

    setGastos(gastosSeguros);

  } catch (error) {
    console.error('Error al validar datos remotos:', error);
    alert('No se pudieron cargar los gastos de forma segura.');
  }
};
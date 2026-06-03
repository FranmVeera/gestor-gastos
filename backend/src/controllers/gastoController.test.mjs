import { describe, test, expect, vi } from 'vitest';

const {
  obtenerGastos,
  crearGasto,
  actualizarGasto,
  eliminarGasto
} = await import('./gastoController.js');

const crearRespuesta = () => {
  const res = {};

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);

  return res;
};

describe('gastoController', () => {
  test('obtiene gastos correctamente', async () => {
    const res = crearRespuesta();

    await obtenerGastos({}, res);

    expect(res.json).toHaveBeenCalled();

    const datos = res.json.mock.calls[0][0];

    expect(Array.isArray(datos)).toBe(true);
  });

  test('crea un gasto correctamente', async () => {
    const req = {
      body: {
        descripcion: 'Gasto de prueba',
        monto: 10,
        categoria: 'Otros',
        fecha: '2026-06-03'
      }
    };

    const res = crearRespuesta();

    await crearGasto(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();

    const gastoCreado = res.json.mock.calls[0][0];

    expect(gastoCreado).toHaveProperty('id');
    expect(gastoCreado.descripcion).toBe('Gasto de prueba');
  });

  test('no crea gasto si faltan campos obligatorios', async () => {
    const req = {
      body: {
        descripcion: '',
        monto: 10,
        categoria: 'Otros',
        fecha: '2026-06-03'
      }
    };

    const res = crearRespuesta();

    await crearGasto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Todos los campos son obligatorios'
    });
  });

  test('actualiza un gasto correctamente', async () => {
    const req = {
      params: { id: '1' },
      body: {
        descripcion: 'Gasto actualizado',
        monto: 12,
        categoria: 'Comida',
        fecha: '2026-06-03'
      }
    };

    const res = crearRespuesta();

    await actualizarGasto(req, res);

    expect(res.json).toHaveBeenCalled();

    const respuesta = res.json.mock.calls[0][0];

    expect(respuesta).toHaveProperty('mensaje');
  });

  test('devuelve 404 si el gasto a actualizar no existe', async () => {
    const req = {
      params: { id: '999999' },
      body: {
        descripcion: 'No existe',
        monto: 15,
        categoria: 'Otros',
        fecha: '2026-06-03'
      }
    };

    const res = crearRespuesta();

    await actualizarGasto(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Gasto no encontrado'
    });
  });

  test('elimina un gasto correctamente', async () => {
    const crearReq = {
      body: {
        descripcion: 'Gasto para eliminar',
        monto: 8,
        categoria: 'Otros',
        fecha: '2026-06-03'
      }
    };

    const crearRes = crearRespuesta();

    await crearGasto(crearReq, crearRes);

    const gastoCreado = crearRes.json.mock.calls[0][0];

    const eliminarReq = {
      params: { id: String(gastoCreado.id) }
    };

    const eliminarRes = crearRespuesta();

    await eliminarGasto(eliminarReq, eliminarRes);

    expect(eliminarRes.json).toHaveBeenCalledWith({
      mensaje: 'Gasto eliminado correctamente'
    });
  });

  test('maneja la eliminación de un gasto inexistente sin romper la API', async () => {
    const req = {
      params: { id: '999999' }
    };

    const res = crearRespuesta();

    await eliminarGasto(req, res);

    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Gasto eliminado correctamente'
    });
  });
});
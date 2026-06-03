import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001/api/gastos';

/**
 * @typedef {Object} GastoAPI
 * @property {number|string} [id]
 * @property {string} [descripcion]
 * @property {number|string} [monto]
 * @property {string} [categoria]
 * @property {string} [fecha]
 */

function App() {
  const [gastos, setGastos] = useState([]);
  const [gastoEditando, setGastoEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    descripcion: '',
    monto: '',
    categoria: '',
    fecha: ''
  });

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

  const totalGastado = gastos.reduce(
    (total, gasto) => total + Number(gasto.monto),
    0
  );

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      descripcion: '',
      monto: '',
      categoria: '',
      fecha: ''
    });
    setGastoEditando(null);
  };

  const guardarGasto = async (evento) => {
    evento.preventDefault();

    const metodo = gastoEditando ? 'PUT' : 'POST';
    let url = API_URL;

    if (gastoEditando) {
      const id = Number(gastoEditando);
      if (!Number.isInteger(id) || id <= 0) {
        alert('ID inválido');
        return;
      }
      url = `${API_URL}/${id}`;
    }

    await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formulario,
        monto: Number(formulario.monto)
      })
    });

    limpiarFormulario();
    obtenerGastos();
  };

  const prepararEdicion = (gasto) => {
    const id = Number(gasto.id);
    if (!Number.isInteger(id) || id <= 0) {
      alert('ID de gasto inválido');
      return;
    }
    setGastoEditando(id);
    setFormulario({
      descripcion: String(gasto.descripcion || ''),
      monto: Number(gasto.monto) || 0,
      categoria: String(gasto.categoria || ''),
      fecha: String(gasto.fecha || '')
    });
  };

  const eliminarGasto = async (id) => {
    const idSeguro = Number(id);
    if (!Number.isInteger(idSeguro) || idSeguro <= 0) {
      alert('ID de gasto inválido');
      return;
    }
    await fetch(`${API_URL}/${idSeguro}`, {
      method: 'DELETE'
    });
    obtenerGastos();
  };

  useEffect(() => {
    obtenerGastos();
  }, []);

  return (
    <main className="contenedor">
      <h1>Gestor de Gastos Personales</h1>

      <section className="resumen">
        <div className="resumen-tarjeta">
          <span>Total gastado</span>
          <strong>${totalGastado.toFixed(2)}</strong>
        </div>
        <div className="resumen-tarjeta">
          <span>Registros</span>
          <strong>{gastos.length}</strong>
        </div>
      </section>

      <form className="formulario" onSubmit={guardarGasto}>
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción del gasto"
          value={formulario.descripcion}
          onChange={manejarCambio}
          required
        />
        <input
          type="number"
          name="monto"
          placeholder="Monto"
          value={formulario.monto}
          onChange={manejarCambio}
          min="0"
          step="0.01"
          required
        />
        <select
          name="categoria"
          value={formulario.categoria}
          onChange={manejarCambio}
          required
        >
          <option value="">Selecciona una categoría</option>
          <option value="Comida">Comida</option>
          <option value="Transporte">Transporte</option>
          <option value="Salud">Salud</option>
          <option value="Educación">Educación</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Snack">Snack</option>
          <option value="Otros">Otros</option>
        </select>
        <input
          type="date"
          name="fecha"
          value={formulario.fecha}
          onChange={manejarCambio}
          required
        />
        <button type="submit">
          {gastoEditando ? 'Actualizar gasto' : 'Guardar gasto'}
        </button>
        {gastoEditando && (
          <button
            className="boton-secundario"
            type="button"
            onClick={limpiarFormulario}
          >
            Cancelar edición
          </button>
        )}
      </form>

      <section className="lista">
        <h2>Listado de gastos</h2>
        {gastos.length === 0 ? (
          <p>No hay gastos registrados.</p>
        ) : (
          gastos.map((gasto) => (
            <article className="tarjeta" key={gasto.id}>
              <div>
                <h3>{gasto.descripcion}</h3>
                <p>Categoría: {gasto.categoria}</p>
                <p>Fecha: {gasto.fecha}</p>
              </div>
              <strong>${Number(gasto.monto).toFixed(2)}</strong>
              <div className="acciones">
                <button className="editar" onClick={() => prepararEdicion(gasto)}>
                  Editar
                </button>
                <button className="eliminar" onClick={() => eliminarGasto(gasto.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
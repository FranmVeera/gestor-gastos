import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import App from './App';

const gastosMock = [
  {
    id: 1,
    descripcion: 'Almuerzo',
    monto: 5,
    categoria: 'Comida',
    fecha: '2026-06-02'
  },
  {
    id: 2,
    descripcion: 'Bus',
    monto: 1.5,
    categoria: 'Transporte',
    fecha: '2026-06-01'
  }
];

beforeEach(() => {
  globalThis.fetch = vi.fn((url, options) => {
    if (!options) {
      return Promise.resolve({
        json: () => Promise.resolve(gastosMock)
      });
    }

    return Promise.resolve({
      json: () => Promise.resolve({
        id: 3,
        descripcion: 'Nuevo gasto',
        monto: 10,
        categoria: 'Otros',
        fecha: '2026-06-03'
      })
    });
  });
});

describe('Gestor de Gastos', () => {
  test('muestra el título principal', async () => {
    render(<App />);

    expect(
      screen.getByText('Gestor de Gastos Personales')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Almuerzo')).toBeInTheDocument();
    });
  });

  test('muestra el total gastado y cantidad de registros', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('$6.50')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  test('permite registrar un gasto', async () => {
    render(<App />);

    await userEvent.type(
      screen.getByPlaceholderText('Descripción del gasto'),
      'Cena'
    );

    await userEvent.type(
      screen.getByPlaceholderText('Monto'),
      '12'
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      'Comida'
    );

    const fecha = document.querySelector('input[type="date"]');
    await userEvent.type(fecha, '2026-06-04');

    await userEvent.click(
      screen.getByRole('button', { name: 'Guardar gasto' })
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/gastos',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('permite preparar la edición de un gasto', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Almuerzo')).toBeInTheDocument();
    });

    const botonesEditar = screen.getAllByText('Editar');
    await userEvent.click(botonesEditar[0]);

    expect(screen.getByDisplayValue('Almuerzo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Comida')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-06-02')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Actualizar gasto' })
    ).toBeInTheDocument();
  });

  test('permite actualizar un gasto', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Almuerzo')).toBeInTheDocument();
    });

    const botonesEditar = screen.getAllByText('Editar');
    await userEvent.click(botonesEditar[0]);

    const descripcion = screen.getByDisplayValue('Almuerzo');
    await userEvent.clear(descripcion);
    await userEvent.type(descripcion, 'Almuerzo actualizado');

    await userEvent.click(
      screen.getByRole('button', { name: 'Actualizar gasto' })
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/gastos/1',
        expect.objectContaining({
          method: 'PUT'
        })
      );
    });
  });

  test('permite cancelar la edición', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Almuerzo')).toBeInTheDocument();
    });

    const botonesEditar = screen.getAllByText('Editar');
    await userEvent.click(botonesEditar[0]);

    await userEvent.click(
      screen.getByRole('button', { name: 'Cancelar edición' })
    );

    expect(
      screen.getByRole('button', { name: 'Guardar gasto' })
    ).toBeInTheDocument();
  });

  test('permite eliminar un gasto', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Almuerzo')).toBeInTheDocument();
    });

    const botonesEliminar = screen.getAllByText('Eliminar');
    await userEvent.click(botonesEliminar[0]);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/gastos/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });
});
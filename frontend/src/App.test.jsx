import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import App from './App';

beforeEach(() => {
  globalThis.fetch = vi.fn((url, options) => {
    if (!options) {
      return Promise.resolve({
        json: () => Promise.resolve([])
      });
    }

    return Promise.resolve({
      json: () => Promise.resolve({
        id: 1,
        descripcion: 'Almuerzo',
        monto: 5,
        categoria: 'Comida',
        fecha: '2026-06-02'
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
  });

  test('permite registrar un gasto', async () => {
    render(<App />);

    await userEvent.type(
      screen.getByPlaceholderText('Descripción del gasto'),
      'Almuerzo'
    );

    await userEvent.type(
      screen.getByPlaceholderText('Monto'),
      '5'
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      'Comida'
    );

    await userEvent.type(
      screen.getByDisplayValue(''),
      '2026-06-02'
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Guardar gasto' })
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
  });
});
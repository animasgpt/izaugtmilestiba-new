import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import AdminLogin from '../pages/AdminLogin';

const api = vi.hoisted(() => ({ getSession: vi.fn(), signInWithPassword: vi.fn(), maybeSingle: vi.fn(), signOut: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => {
  const roles = { select: () => roles, eq: () => roles, maybeSingle: api.maybeSingle };
  return { supabase: { auth: { getSession: api.getSession, signInWithPassword: api.signInWithPassword, signOut: api.signOut }, from: () => roles } };
});
beforeEach(() => {
  vi.clearAllMocks();
  api.maybeSingle.mockResolvedValue({ data: { role: 'admin' } });
  api.signInWithPassword.mockResolvedValue({ data: { user: { id: 'admin-user' } }, error: null });
});
afterEach(cleanup);

it.each([true, false])('opens contact submissions after Supabase login (existing session: %s)', async existingSession => {
  api.getSession.mockResolvedValue({ data: { session: existingSession ? { user: { id: 'admin-user' } } : null } });
  render(<MemoryRouter initialEntries={['/admin-login']}><Routes>
    <Route path="/admin-login" element={<AdminLogin />} />
    <Route path="/admin/pieteikumi" element={<h1>Saglabātie pieteikumi</h1>} />
    <Route path="/admin" element={<h1>Sanity redaktors</h1>} />
  </Routes></MemoryRouter>);
  if (!existingSession) {
    fireEvent.change(screen.getByLabelText('E-pasts'), { target: { value: 'admin@example.test' } });
    fireEvent.change(screen.getByLabelText('Parole'), { target: { value: 'test-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Pieslēgties' }));
  }
  expect(await screen.findByRole('heading', { name: 'Saglabātie pieteikumi' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Sanity redaktors' })).not.toBeInTheDocument();
});

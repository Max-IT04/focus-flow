const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const login = async (login, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || 'Ошибка входа' };
  localStorage.setItem('token', data.token);
  return { error: null, res: data.user };
};

export const register = async (login, email, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || 'Ошибка регистрации' };
  localStorage.setItem('token', data.token);
  return { error: null, res: data.user };
};

export const getMe = async () => {
  const token = localStorage.getItem('token');
  if (!token) return { error: 'Нет токена' };
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { error: 'Не авторизован' };
  const user = await res.json();
  return { error: null, res: user };
};

export const getToken = () => localStorage.getItem('token');
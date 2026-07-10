import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const fetchTimeSessions = async () => {
  const token = getToken();
  if (!token) return { error: 'Нет авторизации', res: null };

  const response = await fetch(`${API_URL}/time-sessions`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return { error: 'Ошибка загрузки замеров', res: null };
  const sessions = await response.json();
  return { error: null, res: sessions };
};
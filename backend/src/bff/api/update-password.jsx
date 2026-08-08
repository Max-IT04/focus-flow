import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const updatePassword = async ({ oldPassword, newPassword }) => {
  const token = getToken();
  if (!token) return { error: 'Нет авторизации', res: null };

  const response = await fetch(`${API_URL}/users/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, password: newPassword }),
  });

  if (!response.ok) {
    const data = await response.json();
    return { error: data.error || 'Ошибка смены пароля', res: null };
  }
  return { error: null, res: { message: 'Пароль обновлён' } };
};
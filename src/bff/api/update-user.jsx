import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const updateUser = async (userData) => {
  const token = getToken();
  if (!token) return { error: 'Нет авторизации', res: null };

  const response = await fetch(`${API_URL}/users/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) return { error: 'Ошибка обновления', res: null };
  const updatedUser = await response.json();
  return { error: null, res: updatedUser };
};
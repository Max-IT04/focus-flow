import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const removeProject = async (id) => {
  const token = getToken();
  if (!token) return { error: 'Нет авторизации', res: null };

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return { error: 'Ошибка удаления проекта', res: null };
  return { error: null, res: id };
};
import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const updateProject = async (id, projectData) => {
  const token = getToken();
  if (!token) return { error: 'Нет авторизации', res: null };

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) return { error: 'Ошибка обновления проекта', res: null };
  const updatedProject = await response.json();
  return { error: null, res: updatedProject };
};
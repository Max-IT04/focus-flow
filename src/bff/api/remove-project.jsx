export const removeProject = async (id) => {
  const response = await fetch(`http://localhost:3001/projects/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    return { error: 'Ошибка удаления проекта', res: null };
  }

  return { error: null, res: id };
}
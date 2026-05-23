export const removeProject = async (session, id) => {
  const user = session?.user;
  if (!user) {
    return { error: 'Нет авторизации', res: null };
  }

  const checkResponse = await fetch(`http://localhost:3001/projects/${id}`);
  const project = await checkResponse.json();

  if (project.userId !== user.id) {
    return { error: 'Нет доступа к этому проекту', res: null };
  }

  const response = await fetch(`http://localhost:3001/projects/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    return { error: 'Ошибка удаления проекта', res: null };
  }

  return { error: null, res: id };
}
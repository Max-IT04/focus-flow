export const updateProject = async (session, id, projectData) => {
  const user = session?.user;
  if (!user) {
    return { error: 'Нет авторизации', res: null };
  }

  const checkResponse = await fetch(`http://localhost:3001/projects/${id}`);
  const existingProject = await checkResponse.json();

  if (existingProject.userId !== user.id) {
    return { error: 'Нет доступа к этому проекту', res: null };
  }

  const response = await fetch(`http://localhost:3001/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      ...existingProject,
      name: projectData.name,
      description: projectData.description, 
    }), 
  });

  if (!response.ok) {
    return { error: 'Ошибка обновления проекта', res: null };
  }

  const updatedProject = await response.json();
  return { error: null, res: updatedProject };
};
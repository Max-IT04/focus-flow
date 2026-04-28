export const updateProject = async (id, projectData) => {
  const response = await fetch(`http://localhost:3001/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
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
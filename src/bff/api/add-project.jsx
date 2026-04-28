export const addProject = async (projectData) => {
  const response = await fetch('http://localhost:3001/projects', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      name: projectData.name, 
      description: projectData.description,
      createdAt: new Date().toISOString(), 
    }),
  });

  if (!response.ok) {
    return { error: 'Ошибка создания проекта', res: null };
  }

  const newProject = await response.json();
  return { error: null, res: newProject };
};
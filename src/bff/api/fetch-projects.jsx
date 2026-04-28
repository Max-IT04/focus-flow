export const fetchProjects = async () => {
  const response = await fetch('http://localhost:3001/projects');

  if (!response.ok) {
    return { error: 'Ошибка загрузки проектов', res: null};
  }

  const projects = await response.json();
  return { error: null, res: projects }
};
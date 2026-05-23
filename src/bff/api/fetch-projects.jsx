export const fetchProjects = async (session) => {
  const user = session?.user;
  if (!user) {
    return { error: 'Нет авторизации', res: null };
  }

  const response = await fetch(`http://localhost:3001/projects?userId=${user.id}`);

  if (!response.ok) {
    return { error: 'Ошибка загрузки проектов', res: null};
  }

  const projects = await response.json();
  return { error: null, res: projects }
};
export const updateUser = async (session, id, userData) => {
  const user = session?.user;
  if (!user) {
    return { error: 'Нет авторизации', res: null };
  }

  const response = await fetch(`http://localhost:3001/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: userData.login }),
  });
  
  if (!response.ok) return { error: 'Ошибка обновления', res: null };
  const updatedUser = await response.json();
  
  const sessionsRes = await fetch(`http://localhost:3001/sessions`);
  const sessions = await sessionsRes.json();
  
  const userSessions = sessions.filter(s => s.user?.id === id);
  
  for (const session of userSessions) {
    const updatedSessionUser = { ...session.user, login: userData.login };
    await fetch(`http://localhost:3001/sessions/${session.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: updatedSessionUser }),
    });
  }
  
  return { error: null, res: updatedUser };
};